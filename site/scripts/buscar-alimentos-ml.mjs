// Búsqueda de alimentos en el catálogo de Mercado Libre (T08) — SOLO LECTURA.
// Arma la lista corta de alimentos para perro y gato: solo productos de catálogo (/p/MLA…)
// con al menos un vendedor activo, con precio, cantidad de vendedores, foto y atributos.
// - Lee el token de .ml-token-cache.json. NO lo renueva ni escribe el caché:
//   el refresh_token es de un solo uso y renovarlo acá dejaría al sitio sin token.
// - Solo hace llamadas GET. Nunca imprime el token.
// Uso en el servidor (búsquedas por defecto: marcas comunes de perro y gato):
//   docker exec $(docker ps -qf "name=tiendaosvaldo") node /app/scripts/buscar-alimentos-ml.mjs
// Con búsquedas propias (mascota:texto):
//   docker exec $(docker ps -qf "name=tiendaosvaldo") node /app/scripts/buscar-alimentos-ml.mjs "perro:royal canin maxi" "gato:cat chow"
// Resultado: se imprime en pantalla y queda completo en /app/alimentos-ml.json.
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const DEFAULT = {
  perro: [
    "alimento perro adulto", "alimento perro cachorro", "alimento perro raza grande",
    "royal canin perro", "eukanuba perro", "pro plan perro", "dog chow", "excellent perro",
    "old prince perro", "vital can perro", "sieger perro", "nutrique perro",
  ],
  gato: [
    "alimento gato adulto", "alimento gato castrado", "alimento gatito",
    "royal canin gato", "pro plan gato", "cat chow", "excellent gato", "whiskas",
    "vital cat", "old prince gato", "sieger gato",
  ],
}
const POR_BUSQUEDA = 15      // resultados pedidos a /products/search por búsqueda
const HIJOS_POR_FAMILIA = 3  // variantes (pesos) a revisar de cada producto "familia"
const NUEVOS_POR_BUSQUEDA = 25
const PAUSA_MS = 150
const DOMINIO_OK = /FOOD/i   // MLA-CAT_AND_DOG_FOODS y similares

// ── Búsquedas ──────────────────────────────────────────────────────────────
const busquedas = []
const args = process.argv.slice(2)
if (args.length) {
  for (const a of args) {
    const m = a.match(/^(perro|gato):(.+)$/i)
    if (!m) { console.log(`No entiendo "${a}". Formato: perro:texto o gato:texto`); process.exit(1) }
    busquedas.push({ mascota: m[1].toLowerCase(), q: m[2].trim() })
  }
} else {
  for (const [mascota, qs] of Object.entries(DEFAULT)) for (const q of qs) busquedas.push({ mascota, q })
}

// ── Token (solo lectura) ───────────────────────────────────────────────────
const cachePath = join(process.cwd(), ".ml-token-cache.json")
let cache
try { cache = JSON.parse(readFileSync(cachePath, "utf8")) }
catch { console.log("No encontré", cachePath, "— corré el comando desde /app"); process.exit(1) }

const minLeft = Math.round((cache.expiresAt - Date.now()) / 60000)
if (minLeft <= 0) {
  console.log(`El token del caché venció hace ${-minLeft} min. Abrí https://tiendaosvaldo.com.ar/api/ml-auth, aceptá (T37) y volvé a correr esto.`)
  process.exit(1)
}

const H = { Authorization: `Bearer ${cache.token}`, Accept: "application/json" }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let llamadas = 0
async function get(path, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    llamadas++
    try {
      const r = await fetch("https://api.mercadolibre.com" + path, { headers: H })
      if (r.status === 429) { await sleep(2000 * (i + 1)); continue }
      const txt = await r.text()
      let json = null; try { json = JSON.parse(txt) } catch {}
      await sleep(PAUSA_MS)
      return { status: r.status, json }
    } catch (e) {
      if (i === intentos - 1) return { status: 0, error: String(e) }
      await sleep(1000)
    }
  }
  return { status: 429 }
}

const me = await get("/users/me")
if (me.status !== 200) {
  console.log(`El token no sirve: /users/me respondió ${me.status}. Abrí https://tiendaosvaldo.com.ar/api/ml-auth, aceptá (T37) y volvé a correr esto.`)
  process.exit(1)
}
console.log(`Token OK (cuenta ${me.json?.nickname}, le quedan ${minLeft} min). ${busquedas.length} búsquedas…`)

// ── Helpers ────────────────────────────────────────────────────────────────
const ATR = /marca|mascota|edad|tama|raza|peso|sabor|etapa|l[ií]nea|variedad/i
function atributos(attrs) {
  if (!Array.isArray(attrs)) return []
  return attrs.filter((a) => a?.value_name && ATR.test(a.name ?? "")).map((a) => `${a.name}: ${a.value_name}`).slice(0, 6)
}
function foto(p) {
  const pic = p?.pictures?.[0]
  if (!pic) return { imagen: null, fotoOriginal: null }
  // Mismo formato que usan los curados (D_NQ_NP_2X_…-F.webp); la URL original queda aparte.
  return { imagen: pic.id ? `https://http2.mlstatic.com/D_NQ_NP_2X_${pic.id}-F.webp` : pic.url ?? null, fotoOriginal: pic.url ?? null }
}

// ── 1. Buscar en el catálogo ───────────────────────────────────────────────
const candidatos = new Map()
const resumenBusquedas = []
for (const { mascota, q } of busquedas) {
  let r = await get(`/products/search?status=active&site_id=MLA&q=${encodeURIComponent(q)}&limit=${POR_BUSQUEDA}`)
  if (r.status === 400) r = await get(`/products/search?status=active&site_id=MLA&q=${encodeURIComponent(q)}&limit=10`)
  const res = Array.isArray(r.json?.results) ? r.json.results : []
  let nuevos = 0, otrosDominios = 0
  for (const p of res) {
    if (p.domain_id && !DOMINIO_OK.test(p.domain_id)) { otrosDominios++; continue }
    const hijos = Array.isArray(p.children_ids) ? p.children_ids.slice(0, HIJOS_POR_FAMILIA) : []
    for (const id of [p.id, ...hijos]) {
      const ya = candidatos.get(id)
      if (ya) { if (!ya.busquedas.includes(q)) ya.busquedas.push(q); continue }
      if (nuevos >= NUEVOS_POR_BUSQUEDA) continue
      const esPadre = id === p.id
      candidatos.set(id, {
        id, mascota, busquedas: [q],
        nombre: esPadre ? p.name ?? null : null,
        dominio: p.domain_id ?? null,
        familia: esPadre ? null : p.id,
        atributos: esPadre ? atributos(p.attributes) : [],
        ...(esPadre ? foto(p) : { imagen: null, fotoOriginal: null }),
      })
      nuevos++
    }
  }
  resumenBusquedas.push({ mascota, q, status: r.status, total: r.json?.paging?.total ?? null, nuevos, otrosDominios, error: r.status === 200 ? undefined : (r.json?.message ?? r.error) })
  if (r.status !== 200) console.log(`  "${q}": respondió ${r.status} ${r.json?.message ?? ""}`)
}
console.log(`${candidatos.size} productos de alimento para revisar. Consultando vendedores…`)

// ── 2. Vendedores y precio de cada uno ─────────────────────────────────────
let n = 0
for (const c of candidatos.values()) {
  const it = await get(`/products/${c.id}/items`)
  if (it.status === 200) {
    const rs = Array.isArray(it.json?.results) ? it.json.results : []
    c.vendedores = it.json?.paging?.total ?? rs.length
    const precios = rs.map((x) => x.price).filter((x) => typeof x === "number" && x > 0)
    c.precioDesde = precios.length ? Math.min(...precios) : null
    c.tiendaOficial = rs.some((x) => x.official_store_id)
    c.envioGratis = rs.some((x) => x.shipping?.free_shipping)
  } else {
    c.vendedores = 0
    c.itemsStatus = it.status
  }
  if (c.vendedores > 0 && (!c.nombre || !c.imagen || !c.atributos.length)) {
    const d = await get(`/products/${c.id}`)
    if (d.status === 200) {
      c.nombre ??= d.json?.name ?? null
      c.dominio ??= d.json?.domain_id ?? null
      if (!c.atributos.length) c.atributos = atributos(d.json?.attributes)
      if (!c.imagen) Object.assign(c, foto(d.json))
    }
  }
  c.link = `https://www.mercadolibre.com.ar/p/${c.id}`
  if (++n % 25 === 0) console.log(`  ${n}/${candidatos.size}`)
}

// ── 3. Resultado ───────────────────────────────────────────────────────────
const fmt = (v) => (v == null ? "sin precio" : "$ " + Math.round(v).toLocaleString("es-AR"))
const todos = [...candidatos.values()]
const conVendedores = todos.filter((c) => c.vendedores > 0 && (!c.dominio || DOMINIO_OK.test(c.dominio)))
for (const mascota of ["perro", "gato"]) {
  const lista = conVendedores
    .filter((c) => c.mascota === mascota)
    .sort((a, b) => b.vendedores - a.vendedores || (a.precioDesde ?? 1e12) - (b.precioDesde ?? 1e12))
  console.log(`\n=== ${mascota.toUpperCase()}: ${lista.length} productos con vendedores ===`)
  for (const c of lista) {
    const extras = [c.tiendaOficial && "tienda oficial", c.envioGratis && "envío gratis"].filter(Boolean).join(", ")
    console.log(`${c.id} | ${c.vendedores} vend. | desde ${fmt(c.precioDesde)}${extras ? " | " + extras : ""} | ${c.nombre ?? "(sin nombre)"}`)
  }
}

const archivo = join(process.cwd(), "alimentos-ml.json")
const out = { fecha: new Date().toISOString(), cuenta: me.json?.nickname, token_minutos_restantes: minLeft, llamadas, busquedas: resumenBusquedas, productos: todos }
try { writeFileSync(archivo, JSON.stringify(out, null, 2)) } catch (e) { console.log("No pude guardar", archivo, String(e)) }
console.log(`\nListo: ${conVendedores.length} con vendedores de ${todos.length} revisados (${llamadas} consultas). Detalle completo en ${archivo}`)
