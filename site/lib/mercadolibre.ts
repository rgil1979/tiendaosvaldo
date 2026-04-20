/**
 * CLIENTE API — MERCADO LIBRE
 * Todo server-side. El token nunca llega al browser.
 *
 * Endpoints confirmados (retornan 200 con APP_USR token):
 *   GET /products/search?status=active&site_id=MLA&...
 *   GET /products/{id}
 *   GET /products/{id}/items
 *   GET /categories/{id}
 */

// ── TOKEN EN MEMORIA ─────────────────────────────────────────────────────────
// Inicializado desde env al arrancar el proceso Node. Se refresca solo.

let _token     = process.env.ML_ACCESS_TOKEN ?? ""
let _expiresAt = 0 // fuerza refresh en el primer request; se actualiza al refrescar

export async function refreshTokenIfNeeded(): Promise<string> {
  const BUFFER = 5 * 60_000 // pedir token nuevo 5 min antes de expirar
  if (_token && Date.now() < _expiresAt - BUFFER) return _token

  const { ML_APP_ID, ML_CLIENT_SECRET, ML_REFRESH_TOKEN } = process.env
  if (!ML_APP_ID || !ML_CLIENT_SECRET || !ML_REFRESH_TOKEN) {
    console.warn("[ML] Credenciales incompletas — usando token actual")
    return _token
  }

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      client_id:     ML_APP_ID,
      client_secret: ML_CLIENT_SECRET,
      refresh_token: ML_REFRESH_TOKEN,
    }),
    cache: "no-store",
  })

  if (!res.ok) {
    console.error(`[ML] Refresh falló: ${res.status} ${res.statusText}`)
    return _token
  }

  const data   = await res.json()
  _token       = data.access_token
  _expiresAt   = Date.now() + (data.expires_in - 300) * 1000
  console.log(`[ML] Token refrescado — expira en ${Math.round(data.expires_in / 60)} min`)
  return _token
}

// ── CLIENTE BASE ─────────────────────────────────────────────────────────────

async function mlFetch<T>(endpoint: string, revalidate = 3600): Promise<T> {
  const token = await refreshTokenIfNeeded()
  const url   = `https://api.mercadolibre.com${endpoint}`

  const res = await fetch(url, {
    next: { revalidate },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`[ML] ${res.status} ${res.statusText} — ${endpoint}\n${body.slice(0, 200)}`)
  }

  return res.json() as Promise<T>
}

// ── TIPOS PÚBLICOS ───────────────────────────────────────────────────────────

export interface MLProductSummary {
  id:                 string
  catalog_product_id: string
  domain_id:          string
  name:               string
  attributes:         { id: string; name: string; value_name: string }[]
}

export interface MLProductFull {
  id:                  string
  name:                string
  pictures:            { id: string; url: string }[]
  short_description:   string
  main_features:       string[]
  attributes:          { id: string; name: string; value_name: string | null }[]
  domain_id:           string
  status:              string
  price:               number
  item_id:             string
  currency_id:         string
  condition:           "new" | "used"
  warranty:            string | null
  accepts_mercadopago: boolean
  free_shipping:       boolean
  affiliateUrl:        string
}

// Alias de compatibilidad — código existente que usa MLProduct sigue compilando
export type MLProduct = MLProductFull

export interface MLSearchResult {
  products: MLProductSummary[]
  total:    number
  hasMore:  boolean
}

export interface MLCategory {
  id:                           string
  name:                         string
  total_items_in_this_category: number
  children_categories:          { id: string; name: string; total_items_in_this_category: number }[]
}

// Tipos internos — solo usados dentro de este módulo
interface _MLProductDetail {
  id:                string
  name:              string
  pictures:          { id: string; url: string }[]
  short_description: { content: string } | null
  main_features:     { text: string }[]  | null
  attributes:        { id: string; name: string; value_name: string | null }[]
  domain_id:         string
  status:            string
}

interface _MLPriceItem {
  item_id:             string
  price:               number
  currency_id:         string
  condition:           "new" | "used"
  warranty:            string | null
  accepts_mercadopago: boolean
  free_shipping?:      boolean
}

// ── AFFILIATE URL ────────────────────────────────────────────────────────────

export function buildAffiliateUrl(productId: string): string {
  const id = process.env.ML_AFFILIATE_ID ?? ""
  return `https://www.mercadolibre.com.ar/p/${productId}?partner_id=cbpar_${id}`
}

// Alias: versión legacy que acepta un permalink completo
export function buildAffiliateLink(permalink: string): string {
  try {
    const url  = new URL(permalink)
    const id   = process.env.NEXT_PUBLIC_ML_AFFILIATE_ID ?? process.env.ML_AFFILIATE_ID ?? ""
    if (id) url.searchParams.set("partner_id", id)
    return url.toString()
  } catch {
    return permalink
  }
}

// ── BÚSQUEDA ─────────────────────────────────────────────────────────────────

export async function getProducts(options: {
  query?:      string
  domainId?:   string
  categoryId?: string
  limit?:      number
  offset?:     number
}): Promise<MLSearchResult> {
  const { query, domainId, limit = 20, offset = 0 } = options

  const params = new URLSearchParams({
    status:  "active",
    site_id: "MLA",
    limit:   String(Math.min(limit, 50)),
    offset:  String(offset),
  })
  if (query)              params.set("q",         query)
  if (domainId?.trim())   params.set("domain_id", domainId)

  try {
    const data = await mlFetch<{
      paging:  { total: number; limit: number; offset: number }
      results: MLProductSummary[]
    }>(`/products/search?${params}`, 3600)

    const results = data.results ?? []
    return {
      products: results,
      total:    data.paging.total,
      hasMore:  offset + results.length < data.paging.total,
    }
  } catch (e) {
    console.error("[ML] getProducts falló:", (e as Error).message)
    return { products: [], total: 0, hasMore: false }
  }
}

// ── DETALLE DE PRODUCTO ──────────────────────────────────────────────────────

export async function getProduct(productId: string): Promise<MLProductFull> {
  const [detail, priceResp] = await Promise.all([
    mlFetch<_MLProductDetail>(`/products/${productId}`, 3600),
    mlFetch<{ results: _MLPriceItem[] }>(`/products/${productId}/items`, 3600).catch(() => ({ results: [] })),
  ])

  const p: _MLPriceItem = priceResp.results?.[0] ?? {
    item_id: "", price: 0, currency_id: "ARS",
    condition: "new", warranty: null, accepts_mercadopago: true, free_shipping: false,
  }

  return {
    id:                  productId,
    name:                detail.name,
    pictures:            detail.pictures          ?? [],
    short_description:   detail.short_description?.content ?? "",
    main_features:       (detail.main_features    ?? []).map((f) => f.text),
    attributes:          detail.attributes         ?? [],
    domain_id:           detail.domain_id,
    status:              detail.status,
    price:               p.price,
    item_id:             p.item_id,
    currency_id:         p.currency_id,
    condition:           p.condition,
    warranty:            p.warranty,
    accepts_mercadopago: p.accepts_mercadopago,
    free_shipping:       p.free_shipping ?? false,
    affiliateUrl:        buildAffiliateUrl(productId),
  }
}

// ── LOTE DE PRODUCTOS ────────────────────────────────────────────────────────
// Máx 10 en paralelo para respetar rate limits de ML

function isAvailable(p: MLProductFull, requirePrice: boolean): boolean {
  if (p.status !== "active") return false
  if (requirePrice && p.price <= 0) return false
  return true
}

export async function getProducts_batch(
  productIds:   string[],
  requirePrice = true,  // por defecto solo muestra productos con precio y status active
): Promise<MLProductFull[]> {
  const CHUNK   = 10
  const results: MLProductFull[] = []

  for (let i = 0; i < productIds.length; i += CHUNK) {
    const settled = await Promise.allSettled(
      productIds.slice(i, i + CHUNK).map((id) => getProduct(id))
    )
    for (const r of settled) {
      if (r.status === "fulfilled") {
        if (isAvailable(r.value, requirePrice)) results.push(r.value)
      } else {
        console.warn("[ML] Producto fallido en batch:", (r.reason as Error).message)
      }
    }
  }
  return results
}

// ── HIGHLIGHTS (best sellers por categoría) ──────────────────────────────────

export async function getHighlights(categoryId: string, limit = 20): Promise<MLProductFull[]> {
  try {
    const data = await mlFetch<{ content: { id: string; type: string }[] }>(
      `/highlights/MLA/category/${categoryId}`,
      3600
    )
    const ids = (data.content ?? []).slice(0, limit).map((c) => c.id)
    return getProducts_batch(ids, true) // highlights siempre con precio
  } catch (e) {
    console.error("[ML] getHighlights falló:", (e as Error).message)
    return []
  }
}

// ── CATEGORÍA ────────────────────────────────────────────────────────────────

export async function getCategory(categoryId: string): Promise<MLCategory> {
  return mlFetch<MLCategory>(`/categories/${categoryId}`, 86_400)
}

// ── UTILIDADES ───────────────────────────────────────────────────────────────

export { formatPrice, getDiscount, getHQThumbnail } from "./ml-utils"

// ── ALIAS DE COMPATIBILIDAD CON VERSIÓN ANTERIOR ─────────────────────────────

export const getProductFromCatalog  = getProduct
export const getProductsFromCatalog = getProducts_batch

// Legacy: searchProducts — devuelve resultado vacío (endpoint /sites/MLA/search da 403)
export async function searchProducts(_params: {
  categoryId: string; limit?: number; offset?: number;
  sort?: string; priceMin?: number; priceMax?: number; condition?: string;
}) {
  return { results: [], paging: { total: 0, offset: 0, limit: 20, primary_results: 0 }, filters: [], available_filters: [] }
}

export async function getProductDescription(_id: string): Promise<{ plain_text: string }> {
  return { plain_text: "" }
}

// Mantener MLFilter/MLSearchResult legacy para CategoryProducts.tsx
export interface MLFilter {
  id:     string
  name:   string
  values: { id: string; name: string; results: number }[]
}
