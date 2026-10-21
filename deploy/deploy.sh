#!/usr/bin/env bash
# Deploy de Tienda Osvaldo. Lo llama GitHub Actions por SSH en cada push a main.
#
# 1. Copia site/ del repo a una carpeta de staging y compila ahí, en un contenedor aparte.
#    Si el build falla, el sitio en producción no se toca.
# 2. Si compila: backup del sitio, copia el resultado a la carpeta en vivo y reinicia.
# 3. Health check. Si falla, vuelve al .next anterior y reinicia de nuevo.
#
# NUNCA se pisan en vivo: .env*, .ml-token-cache.json, scripts/diagnostico-api-ml.mjs, node_modules.
# El build de staging corre SIN refresh token: el refresh token de ML es de un solo uso y si
# el build lo renovara, producción quedaría con uno ya consumido.
set -euo pipefail

BASE=${BASE:-/docker/tiendaosvaldo}
REPO=${REPO:-$BASE/repo}            # clon de git (lo actualiza el workflow antes de llamar acá)
LIVE=${LIVE:-$BASE/site}            # carpeta montada en el contenedor
STAGE=${STAGE:-$BASE/build}         # staging del build
BACKUPS=${BACKUPS:-$BASE/backups}
SERVICE=${SERVICE:-tiendaosvaldo}
NODE_IMAGE=${NODE_IMAGE:-node:20-alpine}
KEEP_BACKUPS=${KEEP_BACKUPS:-5}

log() { echo "[deploy $(date +%H:%M:%S)] $*"; }
compose() { docker compose -f "$BASE/docker-compose.yml" "$@"; }

exec 9>"$BASE/.deploy.lock"
flock -n 9 || { log "Ya hay un deploy corriendo"; exit 1; }

command -v rsync >/dev/null || { log "Falta rsync en el servidor (apt install rsync)"; exit 1; }

# Archivos que existen solo en el servidor. Excluirlos de rsync los protege también de --delete.
PROTECTED=(--exclude=.env --exclude='.env.*' --exclude=.ml-token-cache.json
           --exclude=/scripts/diagnostico-api-ml.mjs --exclude=node_modules/)

# ── 1. Build en staging ─────────────────────────────────────────────────────
log "Commit: $(git -C "$REPO" log -1 --oneline)"
mkdir -p "$STAGE"
rsync -a --delete "${PROTECTED[@]}" --exclude=.next/ "$REPO/site/" "$STAGE/"

# Variables de producción (las que el compose carga con env_file/environment) para que se
# horneen las NEXT_PUBLIC_*, pero sin refresh token.
BUILD_ENV="$BASE/.build.env"
trap 'rm -f "$BUILD_ENV"' EXIT
( umask 077
  compose config --format json | docker run --rm -i "$NODE_IMAGE" node -e '
    let s = ""
    process.stdin.on("data", d => s += d).on("end", () => {
      const env = JSON.parse(s).services[process.argv[1]].environment || {}
      for (const [k, v] of Object.entries(env))
        if (k !== "ML_REFRESH_TOKEN") console.log(`${k}=${v ?? ""}`)
    })' "$SERVICE" > "$BUILD_ENV" )
grep -q '^NEXT_PUBLIC_' "$BUILD_ENV" || { log "El compose no define variables NEXT_PUBLIC_* — abortando"; exit 1; }
log "Variables para el build: $(cut -d= -f1 "$BUILD_ENV" | tr '\n' ' ')"

# Si además hay .env* en el sitio, también van a staging sin refresh token.
for f in "$LIVE"/.env "$LIVE"/.env.*; do
  [ -f "$f" ] || continue
  sed 's/^ML_REFRESH_TOKEN=.*/ML_REFRESH_TOKEN=/' "$f" > "$STAGE/$(basename "$f")"
done
# Access token vigente (si hay) pero sin refresh token: como mucho cae a client_credentials.
if [ -f "$LIVE/.ml-token-cache.json" ]; then
  docker run --rm -v "$LIVE/.ml-token-cache.json:/in.json:ro" "$NODE_IMAGE" node -e '
    const c = JSON.parse(require("fs").readFileSync("/in.json", "utf8"));
    process.stdout.write(JSON.stringify({ ...c, refreshToken: "" }))' > "$STAGE/.ml-token-cache.json"
else
  rm -f "$STAGE/.ml-token-cache.json"
fi

log "Compilando en staging…"
docker run --rm --env-file "$BUILD_ENV" -v "$STAGE:/app" -w /app "$NODE_IMAGE" \
  sh -c "rm -rf .next && npm ci --no-audit --no-fund && npm run build"
[ -f "$STAGE/.next/BUILD_ID" ] || { log "El build no generó .next/BUILD_ID — abortando"; exit 1; }
log "Build OK"

# ── 2. Backup + copia a producción ──────────────────────────────────────────
mkdir -p "$BACKUPS"
BACKUP="$BACKUPS/site-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP" -C "$LIVE" --exclude=./node_modules --exclude=./.next/cache .
ls -1t "$BACKUPS"/site-*.tar.gz | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm -f
log "Backup: $BACKUP"

rm -rf "$LIVE/.next.prev"
[ -d "$LIVE/.next" ] && mv "$LIVE/.next" "$LIVE/.next.prev"
# Código fuente sin --delete: así no se borra nada del servidor que no esté en git.
rsync -a "${PROTECTED[@]}" --exclude=.next/ "$REPO/site/" "$LIVE/"
rsync -a "$STAGE/.next/" "$LIVE/.next/"

# ── 3. Reinicio + health check ──────────────────────────────────────────────
health() {
  for _ in $(seq 1 30); do
    sleep 5
    if compose exec -T "$SERVICE" wget -qO /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
      return 0
    fi
  done
  return 1
}

log "Reiniciando $SERVICE…"
compose up -d --force-recreate --no-deps "$SERVICE"
if health; then
  rm -rf "$LIVE/.next.prev"
  log "Deploy OK"
  exit 0
fi

log "Health check falló — volviendo al .next anterior"
compose logs --tail=80 "$SERVICE" || true
if [ -d "$LIVE/.next.prev" ]; then
  rm -rf "$LIVE/.next"
  mv "$LIVE/.next.prev" "$LIVE/.next"
  compose up -d --force-recreate --no-deps "$SERVICE"
  health && log "Rollback OK (sitio con la versión anterior)" || log "Rollback también falló — revisar a mano. Backup: $BACKUP"
fi
exit 1
