# Deploy automático

Cada push a `main` corre `.github/workflows/deploy.yml`: entra por SSH al servidor, actualiza el clon en `/docker/tiendaosvaldo/repo` y ejecuta `deploy/deploy.sh`.

El script compila en `/docker/tiendaosvaldo/build`, aparte del sitio. Si el build falla, producción no se toca. Si compila, guarda un backup en `/docker/tiendaosvaldo/backups` (quedan los últimos 5), copia el resultado a `/docker/tiendaosvaldo/site`, reinicia el contenedor y hace un health check. Si el health check falla, vuelve al `.next` anterior.

Nunca pisa: `.env*`, `.ml-token-cache.json`, `scripts/diagnostico-api-ml.mjs` ni `node_modules`. El build de staging corre sin refresh token de ML, para no consumir el de producción.

## Configuración inicial (una sola vez)

En el servidor, como root (o como un usuario con acceso a docker y dueño de `/docker/tiendaosvaldo`):

```bash
apt install -y rsync git
cd /docker/tiendaosvaldo
git clone https://github.com/rgil1979/tiendaosvaldo.git repo

# Backup manual antes del primer deploy
tar -czf ~/tiendaosvaldo-pre-deploy.tar.gz --exclude=./site/node_modules .

# Clave SSH solo para el deploy
ssh-keygen -t ed25519 -N "" -f ~/.ssh/deploy_tiendaosvaldo
cat ~/.ssh/deploy_tiendaosvaldo.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/deploy_tiendaosvaldo   # copiar a DEPLOY_SSH_KEY y después borrar el archivo
```

Actualizar `/docker/tiendaosvaldo/docker-compose.yml` con el `command` del repo (ya no compila al arrancar; el build lo hace el script):

```yaml
command: sh -c "npm install --no-audit --no-fund && npm run start"
```

En GitHub → Settings → Secrets and variables → Actions, cargar:

| Secret | Valor |
|---|---|
| `DEPLOY_HOST` | IP o dominio del servidor |
| `DEPLOY_PORT` | puerto SSH (opcional, por defecto 22) |
| `DEPLOY_USER` | usuario SSH |
| `DEPLOY_SSH_KEY` | clave privada generada arriba |

Para probar sin hacer push: Actions → Deploy → Run workflow. También se puede correr a mano en el servidor:

```bash
cd /docker/tiendaosvaldo/repo && git pull && bash deploy/deploy.sh
```

## Volver a una versión anterior

```bash
cd /docker/tiendaosvaldo/site
tar -xzf ../backups/site-AAAAMMDD-HHMMSS.tar.gz --exclude=./.ml-token-cache.json --exclude='./.env*'
docker compose -f ../docker-compose.yml restart tiendaosvaldo
```

Los `--exclude` son obligatorios: el backup incluye `.ml-token-cache.json`, y restaurarlo pisaría el token actual con un refresh token viejo, ya usado.
