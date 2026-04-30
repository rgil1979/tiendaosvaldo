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

// ── VALIDACIÓN DE ENV AL ARRANCAR ─────────────────────────────────────────────
// Falla rápido en lugar de fallar silenciosamente horas después.

const REQUIRED_ENV = ["ML_APP_ID", "ML_CLIENT_SECRET", "ML_REFRESH_TOKEN", "ML_AFFILIATE_ID"] as const

function validateEnv(): void {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  if (missing.length > 0) {
    console.error(`[ML] CONFIGURACIÓN INCOMPLETA — variables faltantes: ${missing.join(", ")}`)
    console.error("[ML] El sitio funcionará en modo degradado hasta que se configuren.")
  }
}

// Solo validar en runtime del servidor, nunca durante npm run build
if (typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
  validateEnv()
}

// ── PERSISTENCIA DE TOKENS EN DISCO ─────────────────────────────────────────
// Hostinger reinicia el proceso en cada deploy. Sin persistencia, el refresh_token
// rotado en memoria se pierde y el siguiente arranque usa el token del .env ya
// inválido → 401. Escribir en disco garantiza que los reinicios lean el token más
// reciente, no el original del .env.

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const TOKEN_CACHE = join(process.cwd(), ".ml-token-cache.json")

interface _TokenCache { token: string; refreshToken: string; expiresAt: number }

function _readCache(): _TokenCache | null {
  try {
    return JSON.parse(readFileSync(TOKEN_CACHE, "utf8")) as _TokenCache
  } catch {
    return null
  }
}

function _writeCache(token: string, refreshToken: string, expiresAt: number): void {
  try {
    writeFileSync(TOKEN_CACHE, JSON.stringify({ token, refreshToken, expiresAt }), "utf8")
  } catch (e) {
    console.warn("[ML] No se pudo guardar token cache en disco:", (e as Error).message)
  }
}

// Inicializar desde caché en disco, con fallback a variables de entorno.
const _cached = _readCache()

let _token        = _cached?.token        ?? process.env.ML_ACCESS_TOKEN  ?? ""
let _refreshToken = _cached?.refreshToken ?? process.env.ML_REFRESH_TOKEN ?? ""
let _expiresAt    = _cached?.expiresAt    ?? 0

if (_cached) {
  console.log("[ML] Tokens cargados desde caché en disco")
}

// Single-flight: evita que requests concurrentes disparen múltiples refreshes.
let _refreshPromise: Promise<string> | null = null

async function _doRefresh(): Promise<string> {
  const { ML_APP_ID, ML_CLIENT_SECRET } = process.env

  if (!ML_APP_ID || !ML_CLIENT_SECRET) {
    console.error("[ML] No se puede refrescar el token — credenciales incompletas")
    return _token
  }

  const oauthPost = async (body: URLSearchParams): Promise<Response> => {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 10_000)
    try {
      const res = await fetch("https://api.mercadolibre.com/oauth/token", {
        method:  "POST",
        signal:  ctrl.signal,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
      })
      return res
    } finally {
      clearTimeout(t)
    }
  }

  // Intentar refresh_token primero (si hay uno disponible)
  if (_refreshToken) {
    try {
      const res = await oauthPost(new URLSearchParams({
        grant_type:    "refresh_token",
        client_id:     ML_APP_ID,
        client_secret: ML_CLIENT_SECRET,
        refresh_token: _refreshToken,
      }))

      if (res.ok) {
        const data = await res.json()
        _token        = data.access_token
        _refreshToken = data.refresh_token ?? _refreshToken
        _expiresAt    = Date.now() + Math.max((data.expires_in ?? 21600) - 300, 0) * 1000
        _writeCache(_token, _refreshToken, _expiresAt)
        console.log(`[ML] Token refrescado — expira en ${Math.round((data.expires_in ?? 21600) / 60)} min`)
        return _token
      }
      console.warn(`[ML] Refresh token inválido (HTTP ${res.status}) — usando client_credentials`)
    } catch (e) {
      const label = (e as Error).name === "AbortError" ? "Timeout 10s" : (e as Error).message
      console.warn(`[ML] OAuth refresh falló: ${label} — usando client_credentials`)
    }
  }

  // Fallback: client_credentials (no requiere refresh_token válido)
  try {
    const res = await oauthPost(new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     ML_APP_ID,
      client_secret: ML_CLIENT_SECRET,
    }))

    if (res.ok) {
      const data = await res.json()
      _token     = data.access_token
      _expiresAt = Date.now() + Math.max((data.expires_in ?? 21600) - 300, 0) * 1000
      _writeCache(_token, _refreshToken, _expiresAt)
      console.log(`[ML] Token obtenido via client_credentials — expira en ${Math.round((data.expires_in ?? 21600) / 60)} min`)
      return _token
    }
    console.error(`[ML] client_credentials falló: HTTP ${res.status}`)
  } catch (e) {
    const label = (e as Error).name === "AbortError" ? "Timeout 10s" : (e as Error).message
    console.error(`[ML] OAuth client_credentials falló: ${label}`)
  }

  return _token
}

async function refreshTokenIfNeeded(): Promise<string> {
  const BUFFER = 5 * 60_000 // refrescar 5 min antes de expirar
  if (_token && Date.now() < _expiresAt - BUFFER) return _token

  // Single-flight: si ya hay un refresh en curso, los demás esperan el mismo resultado
  if (_refreshPromise) return _refreshPromise
  _refreshPromise = _doRefresh().finally(() => { _refreshPromise = null })
  return _refreshPromise
}

// ── CLIENTE BASE ─────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 12_000 // 12s — ISR no debe quedar colgado

async function mlFetch<T>(endpoint: string, revalidate = 3600, _retry = true): Promise<T> {
  const token = await refreshTokenIfNeeded()
  const url   = `https://api.mercadolibre.com${endpoint}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(url, {
      signal: controller.signal,
      next:   { revalidate },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:        "application/json",
      },
    })
  } catch (e) {
    clearTimeout(timer)
    const msg = (e as Error).name === "AbortError"
      ? `[ML] Timeout después de ${FETCH_TIMEOUT_MS}ms — ${endpoint}`
      : `[ML] Error de red — ${endpoint}: ${(e as Error).message}`
    throw new Error(msg)
  }
  clearTimeout(timer)

  // 401 → forzar refresh e intentar una vez más
  if (res.status === 401 && _retry) {
    console.warn("[ML] 401 recibido — forzando refresh de token y reintentando")
    _expiresAt = 0 // invalida el token en memoria para forzar _doRefresh
    return mlFetch<T>(endpoint, revalidate, false)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`[ML] HTTP ${res.status} — ${endpoint.split("?")[0]}\n${body.slice(0, 200)}`)
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


export interface MLSearchResult {
  products: MLProductSummary[]
  total:    number
  hasMore:  boolean
}

// Tipos internos
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

interface _MLItemsResponse {
  results:         _MLPriceItem[]
  buy_box_winner?: {
    item_id:              string
    price:                number
    currency_id:          string
    condition?:           "new" | "used"
    warranty?:            string | null
    accepts_mercadopago?: boolean
    free_shipping?:       boolean
  }
}

// ── AFFILIATE URL ────────────────────────────────────────────────────────────

export function buildAffiliateUrl(productId: string): string {
  const id = (process.env.ML_AFFILIATE_ID ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")
  return `https://www.mercadolibre.com.ar/p/${productId}?partner_id=cbpar_${id}`
}

// ── BÚSQUEDA FILTRADA (centralizada) ─────────────────────────────────────────

type MascotaFilter = "perro" | "gato" | "ambas" | null

interface GetProductsFilteredOptions {
  query?:     string
  domainIds?: string[]
  mascota?:   MascotaFilter
  limit?:     number
  offset?:    number
}

const MASCOTAS_DOMAINS = [
  "MLA-CAT_AND_DOG_FOODS",
  "MLA-CAT_AND_DOG_BEDS",
  "MLA-PET_COLLARS",
  "MLA-PET_HARNESSES",
  "MLA-CATS_LITTER",
  "MLA-PET_CARRIERS_AND_CARRYING_BAGS",
  "MLA-PET_FOOD_STORAGE_CONTAINERS",
]

export async function getProductsFiltered(
  options: GetProductsFilteredOptions,
): Promise<MLSearchResult> {
  const domainsToSearch = options.domainIds ?? MASCOTAS_DOMAINS
  let finalQuery = options.query ?? ""

  if (options.mascota === "perro") finalQuery = `${finalQuery} perro`.trim()
  else if (options.mascota === "gato") finalQuery = `${finalQuery} gato`.trim()

  // Un solo dominio → llamada directa (preserva paginación exacta)
  if (domainsToSearch.length === 1) {
    return getProducts({
      query:    finalQuery || undefined,
      domainId: domainsToSearch[0],
      limit:    options.limit,
      offset:   options.offset,
    })
  }

  // Páginas 2+ con multi-dominio → offset independiente por dominio produce solapamiento.
  // Fallback: primer dominio del array — mantiene resultados dentro de mascotas.
  if ((options.offset ?? 0) > 0) {
    return getProducts({
      query:    finalQuery || undefined,
      domainId: domainsToSearch[0],
      limit:    options.limit,
      offset:   options.offset,
    })
  }

  // Múltiples dominios → paralelo + dedup (búsqueda global, sólo página 1)
  const perDomain = Math.ceil((options.limit ?? 20) * 1.5)
  const responses = await Promise.all(
    domainsToSearch.map((domain) =>
      getProducts({
        query:    finalQuery || undefined,
        domainId: domain,
        limit:    perDomain,
        offset:   options.offset ?? 0,
      }).catch(() => ({ products: [], total: 0, hasMore: false } as MLSearchResult))
    )
  )

  const deduped = new Map<string, MLProductSummary>()
  let totalMax = 0
  for (const res of responses) {
    // Max en vez de suma: evita multiplicar el total por la cantidad de dominios
    if (res.total > totalMax) totalMax = res.total
    for (const p of res.products) {
      if (!deduped.has(p.id)) deduped.set(p.id, p)
    }
  }

  const all = Array.from(deduped.values())
  return {
    products: all.slice(0, options.limit ?? 20),
    total:    Math.min(totalMax, 300),
    hasMore:  all.length > (options.limit ?? 20),
  }
}

// ── BÚSQUEDA ─────────────────────────────────────────────────────────────────

export async function getProducts(options: {
  query?:    string
  domainId?: string
  limit?:    number
  offset?:   number
}): Promise<MLSearchResult> {
  const { query, domainId, limit = 20, offset = 0 } = options

  const params = new URLSearchParams({
    status:  "active",
    site_id: "MLA",
    limit:   String(Math.min(limit, 50)),
    offset:  String(offset),
  })
  if (query)            params.set("q",         query)
  if (domainId?.trim()) params.set("domain_id", domainId)

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
    mlFetch<_MLItemsResponse>(`/products/${productId}/items`, 3600)
      .catch(() => ({ results: [] } as _MLItemsResponse)),
  ])

  // Prioridad: results[0] → buy_box_winner → defaults vacíos
  const winner = priceResp.buy_box_winner
  const first  = priceResp.results?.[0]
  const p: _MLPriceItem = first ?? {
    item_id:             winner?.item_id             ?? "",
    price:               winner?.price               ?? 0,
    currency_id:         winner?.currency_id         ?? "ARS",
    condition:           winner?.condition            ?? "new",
    warranty:            winner?.warranty             ?? null,
    accepts_mercadopago: winner?.accepts_mercadopago  ?? true,
    free_shipping:       winner?.free_shipping        ?? false,
  }

  return {
    id:                  productId,
    name:                detail.name,
    pictures:            detail.pictures                       ?? [],
    short_description:   detail.short_description?.content     ?? "",
    main_features:       (detail.main_features ?? []).map((f) => f.text),
    attributes:          detail.attributes                     ?? [],
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

function isAvailable(p: MLProductFull, requirePrice: boolean): boolean {
  if (p.status !== "active") return false
  if (requirePrice && p.price <= 0) return false
  return true
}

export async function getProducts_batch(
  productIds:   string[],
  requirePrice = true,
): Promise<MLProductFull[]> {
  const settled = await Promise.allSettled(
    productIds.map((id) => getProduct(id))
  )
  const results: MLProductFull[] = []
  for (const r of settled) {
    if (r.status === "fulfilled") {
      if (isAvailable(r.value, requirePrice)) results.push(r.value)
    } else {
      console.warn("[ML] Producto omitido en batch:", (r.reason as Error).message?.slice(0, 100))
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
    const ids = (data.content ?? [])
      .map((c) => c.id)
      .filter((id) => /^MLA\d+$/.test(id))
      .slice(0, Math.min(limit * 2, limit + 10))
    const products = await getProducts_batch(ids, true)
    return products.slice(0, limit)
  } catch (e) {
    console.error("[ML] getHighlights falló:", (e as Error).message?.slice(0, 100))
    return []
  }
}

