// Diagnóstico de la API de Mercado Libre (T28) — SOLO LECTURA.
// - Lee el token de .ml-token-cache.json. NO lo renueva ni escribe nada en el caché:
//   el refresh_token es de un solo uso y renovarlo acá dejaría al sitio sin token.
// - Solo hace llamadas GET. Nunca imprime el token.
// Uso en el servidor:
//   docker exec $(docker ps -qf "name=tiendaosvaldo") node /app/scripts/diagnostico-api-ml.mjs
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const cachePath = join(process.cwd(), ".ml-token-cache.json")
let cache
try { cache = JSON.parse(readFileSync(cachePath, "utf8")) }
catch { console.log("No encontré", cachePath, "— corré el comando desde /app"); process.exit(1) }

const minLeft = Math.round((cache.expiresAt - Date.now()) / 60000)
if (minLeft <= 0) {
  console.log(`El token del caché venció hace ${-minLeft} min. Abrí https://tiendaosvaldo.com.ar/api/ml-auth, aceptá, y volvé a correr esto.`)
  process.exit(1)
}

const H = { Authorization: `Bearer ${cache.token}`, Accept: "application/json" }
async function get(path) {
  const t0 = Date.now()
  try {
    const r = await fetch("https://api.mercadolibre.com" + path, { headers: H })
    const txt = await r.text()
    let json = null; try { json = JSON.parse(txt) } catch {}
    const rl = {}
    for (const [k, v] of r.headers) if (/rate|limit|retry/i.test(k)) rl[k] = v
    return { status: r.status, ms: Date.now() - t0, json, raw: json ? undefined : txt.slice(0, 150), rl }
  } catch (e) { return { status: 0, error: String(e) } }
}

const out = { fecha: new Date().toISOString(), token_minutos_restantes: minLeft, pruebas: {} }
const P = out.pruebas

const me = await get("/users/me")
P.users_me = { status: me.status, id: me.json?.id, nickname: me.json?.nickname }

for (const id of ["MLA15152919", "MLA11212944"]) {
  const d = await get(`/products/${id}`)
  P[`products_${id}`] = { status: d.status, nombre: d.json?.name, estado: d.json?.status, fotos: d.json?.pictures?.length, buy_box_winner: d.json?.buy_box_winner ? { item_id: d.json.buy_box_winner.item_id, price: d.json.buy_box_winner.price } : null }
  const it = await get(`/products/${id}/items`)
  P[`products_${id}_items`] = { status: it.status, cantidad: it.json?.results?.length, primero: it.json?.results?.[0] ? { item_id: it.json.results[0].item_id, price: it.json.results[0].price } : null, error: it.json?.message ?? it.json?.error ?? it.raw, rate_headers: it.rl }
}

// Ítem de catálogo (sale de la prueba anterior) y un ítem curado (Arnés K9, meli.la/13WNuhc)
const itemCatalogo = P["products_MLA11212944_items"]?.primero?.item_id
const itemCurado = "MLA1960782736"
for (const id of [itemCatalogo, itemCurado].filter(Boolean)) {
  const r = await get(`/items/${id}`)
  P[`items_${id}`] = { status: r.status, estado: r.json?.status, sub_estado: r.json?.sub_status, precio: r.json?.price, fotos: r.json?.pictures?.length, catalog_product_id: r.json?.catalog_product_id, error: r.json?.message ?? r.raw }
}
const ids = [itemCatalogo, itemCurado].filter(Boolean).join(",")
const bulk = await get(`/items/bulk?ids=${ids}&attributes=body.id,body.status,body.price`)
P.items_bulk = { status: bulk.status, respuesta: Array.isArray(bulk.json) ? bulk.json.map(x => ({ id: x.id, status_code: x.status_code ?? x.code, estado: x.body?.status, precio: x.body?.price })) : (bulk.json?.message ?? bulk.raw) }
const multi = await get(`/items?ids=${ids}&attributes=id,status,price`)
P.items_multiget_viejo = { status: multi.status, error: Array.isArray(multi.json) ? undefined : (multi.json?.message ?? multi.raw) }

const s1 = await get("/sites/MLA/search?q=arnes%20perro&limit=2")
P.sites_search = { status: s1.status, total: s1.json?.paging?.total, error: s1.json?.message ?? s1.raw }
const s2 = await get("/products/search?status=active&site_id=MLA&q=arnes%20perro&limit=2")
P.products_search = { status: s2.status, total: s2.json?.paging?.total, primeros: s2.json?.results?.map(x => x.id + " " + (x.name ?? "").slice(0, 40)), error: s2.json?.message ?? s2.raw }
const hl = await get("/highlights/MLA/category/MLA1071")
P.highlights_mascotas = { status: hl.status, cantidad: hl.json?.content?.length, error: hl.json?.message ?? hl.raw }

const txt = JSON.stringify(out, null, 2)
console.log(txt)
try { writeFileSync(join(process.cwd(), "diagnostico-api-ml.json"), txt) } catch {}
