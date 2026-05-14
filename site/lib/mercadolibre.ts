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

export function reloadTokenFromCache(): void {
  const fresh = _readCache()
  if (fresh) {
    _token        = fresh.token
    _refreshToken = fresh.refreshToken
    _expiresAt    = fresh.expiresAt
    console.log("[ML] Token recargado en memoria desde caché en disco")
  }
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

async function _getPriceForProduct(productId: string): Promise<_MLPriceItem> {
  const itemsResp = await mlFetch<_MLItemsResponse>(`/products/${productId}/items`, 3600)
    .catch(() => null)

  const winner = itemsResp?.buy_box_winner
  const first  = itemsResp?.results?.[0]
  if (first || winner) {
    return first ?? {
      item_id:             winner!.item_id             ?? "",
      price:               winner!.price               ?? 0,
      currency_id:         winner!.currency_id         ?? "ARS",
      condition:           winner!.condition            ?? "new",
      warranty:            winner!.warranty             ?? null,
      accepts_mercadopago: winner!.accepts_mercadopago  ?? true,
      free_shipping:       winner!.free_shipping        ?? false,
    }
  }

  return {
    item_id: "", price: 0, currency_id: "ARS",
    condition: "new", warranty: null, accepts_mercadopago: true, free_shipping: false,
  }
}

export async function getProduct(productId: string): Promise<MLProductFull> {
  const [detail, p] = await Promise.all([
    mlFetch<_MLProductDetail>(`/products/${productId}`, 3600),
    _getPriceForProduct(productId),
  ])

  return {
    id:                  productId,
    name:                detail.name,
    pictures:            detail.pictures                    ?? [],
    short_description:   detail.short_description?.content  ?? "",
    main_features:       (detail.main_features ?? []).map((f) => f.text),
    attributes:          detail.attributes                  ?? [],
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

// Procesa items con concurrencia limitada para no saturar la API ni crashear el worker.
async function _concurrentMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length)
  let nextIndex = 0
  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const i = nextIndex++
      try {
        results[i] = { status: "fulfilled", value: await fn(items[i]) }
      } catch (reason) {
        results[i] = { status: "rejected", reason }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

export async function getProducts_batch(
  productIds:   string[],
  requirePrice = true,
): Promise<MLProductFull[]> {
  // Máx 8 getProduct() en paralelo → 16 llamadas HTTP simultáneas a ML
  const settled = await _concurrentMap(productIds, (id) => getProduct(id), 8)
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

// ── BÚSQUEDA POR TEXTO (multi-dominio mascotas) ──────────────────────────────

export async function searchByHighlights(query: string, limit: number): Promise<MLProductFull[]> {
  try {
    const result = await getProductsFiltered({ query, limit: Math.min(limit, 50), offset: 0 })
    if (!result.products.length) return []
    return getProducts_batch(result.products.map(p => p.id), true)
  } catch (e) {
    console.error("[ML] searchByHighlights falló:", (e as Error).message)
    return []
  }
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
    const products = await getProducts_batch(ids, false)
    return products.slice(0, limit)
  } catch (e) {
    console.error("[ML] getHighlights falló:", (e as Error).message?.slice(0, 100))
    return []
  }
}

// ── BÚSQUEDA DE ITEMS POR CATEGORÍA ML ──────────────────────────────────────

interface _MLItemSearchItem {
  id:                  string
  catalog_product_id:  string | null
  title:               string
  price:               number
  currency_id:         string
  condition:           "new" | "used"
  thumbnail:           string
  accepts_mercadopago: boolean
  shipping:            { free_shipping: boolean }
  warranty:            string | null
  permalink:           string
}

export async function getItemsByCategory(
  categoryId: string,
  limit = 16,
  offset = 0,
): Promise<{ products: MLProductFull[]; total: number }> {
  try {
    const params = new URLSearchParams({
      category: categoryId,
      limit:    "50",
      offset:   String(offset),
    })
    console.log("[ML] getItemsByCategory →", `/sites/MLA/search?${params}`)
    const data = await mlFetch<{
      paging:  { total: number } | undefined
      results: _MLItemSearchItem[] | undefined
    }>(`/sites/MLA/search?${params}`, 3600)
    console.log("[ML] getItemsByCategory ← total:", data.paging?.total, "results:", data.results?.length)

    const affiliateId = (process.env.ML_AFFILIATE_ID ?? "").toLowerCase().replace(/[^a-z0-9]/g, "")
    const products: MLProductFull[] = (data.results ?? [])
      .slice(0, limit)
      .map((item) => {
        const productId = item.catalog_product_id ?? item.id
        const affiliateUrl = item.catalog_product_id
          ? `https://www.mercadolibre.com.ar/p/${item.catalog_product_id}?partner_id=cbpar_${affiliateId}`
          : `${item.permalink}?partner_id=cbpar_${affiliateId}`
        return {
          id:                  productId,
          name:                item.title,
          pictures:            [{ id: "0", url: (item.thumbnail ?? "").replace(/-[A-Z]\.jpg(\?.*)?$/, "-O.jpg") }],
          short_description:   "",
          main_features:       [],
          attributes:          [],
          domain_id:           "",
          status:              "active",
          price:               item.price ?? 0,
          item_id:             item.id,
          currency_id:         item.currency_id ?? "ARS",
          condition:           item.condition ?? "new",
          warranty:            item.warranty ?? null,
          accepts_mercadopago: item.accepts_mercadopago ?? false,
          free_shipping:       item.shipping?.free_shipping ?? false,
          affiliateUrl,
        }
      })

    return { products, total: data.paging?.total ?? 0 }
  } catch (e) {
    console.error("[ML] getItemsByCategory falló completo:", e)
    return { products: [], total: 0 }
  }
}

// ── PRODUCTOS VARIADOS POR CATEGORÍA (múltiples dominios) ──────────────────────

/**
 * Obtiene productos variados de una mascota (ej: perros)
 * Combina múltiples categorías para devolver variedad
 *
 * Para perros: comida, juguetes, pretales, platos, camas, accesorios
 * Para gatos: comida, juguetes, arena, etc.
 */
export async function getProductsVariety(
  categoryIds: string[],
  limit = 12
): Promise<MLProductFull[]> {
  try {
    // Obtener productos de cada categoría en paralelo
    const itemsPerCategory = Math.ceil(limit * 1.5 / categoryIds.length) // 1.5x para dedup

    const responses = await Promise.all(
      categoryIds.map((catId) =>
        getHighlights(catId, itemsPerCategory).catch(() => [] as MLProductFull[])
      )
    )

    // Combinar y deduplicar por ID
    const deduped = new Map<string, MLProductFull>()
    for (const products of responses) {
      for (const p of products) {
        if (!deduped.has(p.id)) {
          deduped.set(p.id, p)
        }
      }
    }

    // Retornar cantidad exacta
    return Array.from(deduped.values()).slice(0, limit)
  } catch (e) {
    console.error("[ML] getProductsVariety falló:", (e as Error).message)
    return []
  }
}

// ── PRODUCTOS VARIADOS PARA GATOS ────────────────────────────────────────────

export async function getCatProductsVariety(limit = 12): Promise<MLProductFull[]> {
  const catCategories = [
    "MLA1081",   // Comida para gatos
    "MLA434761", // Juguetes para gatos
    "MLA1084",   // Arena para gatos
    "MLA1085",   // Platos para gatos
    "MLA434762", // Camas para gatos
    "MLA434763", // Accesorios para gatos
  ]

  try {
    const itemsPerCategory = Math.ceil(limit * 1.5 / catCategories.length)

    const responses = await Promise.all(
      catCategories.map((catId) =>
        getHighlights(catId, itemsPerCategory).catch(() => [] as MLProductFull[])
      )
    )

    const deduped = new Map<string, MLProductFull>()
    for (const products of responses) {
      for (const p of products) {
        if (!deduped.has(p.id)) {
          deduped.set(p.id, p)
        }
      }
    }

    return Array.from(deduped.values()).slice(0, limit)
  } catch (e) {
    console.error("[ML] getCatProductsVariety falló:", (e as Error).message)
    return []
  }
}

// ── PRODUCTOS VARIADOS PARA ACCESORIOS ───────────────────────────────────────

export async function getAccessoriesVariety(limit = 12): Promise<MLProductFull[]> {
  const accessoriesCategories = [
    "MLA370459", // Correas/Pretales
    "MLA1076",   // Platos/Comederos
    "MLA434758", // Camas
    "MLA434757", // Juguetes
    "MLA1084",   // Transportines/Accesorios
    "MLA434759", // Accesorios variados
  ]

  try {
    const itemsPerCategory = Math.ceil(limit * 1.5 / accessoriesCategories.length)

    const responses = await Promise.all(
      accessoriesCategories.map((catId) =>
        getHighlights(catId, itemsPerCategory).catch(() => [] as MLProductFull[])
      )
    )

    const deduped = new Map<string, MLProductFull>()
    for (const products of responses) {
      for (const p of products) {
        if (!deduped.has(p.id)) {
          deduped.set(p.id, p)
        }
      }
    }

    return Array.from(deduped.values()).slice(0, limit)
  } catch (e) {
    console.error("[ML] getAccessoriesVariety falló:", (e as Error).message)
    return []
  }
}

// ── PRODUCTOS DESTACADOS PARA MASCOTAS (categoría general) ─────────────────────

export async function getPetsHighlights(limit = 12): Promise<MLProductFull[]> {
  const petCategories = [
    "MLA434757", // Juguetes perros
    "MLA434761", // Juguetes gatos
    "MLA434758", // Camas perros
    "MLA434762", // Camas gatos
    "MLA370459", // Pretales/Correas
    "MLA434759", // Accesorios perros
    "MLA1084",   // Arena para gatos
    "MLA434763", // Accesorios gatos
  ]

  try {
    const itemsPerCategory = Math.ceil(limit * 1.5 / petCategories.length)
    const responses = await Promise.all(
      petCategories.map((catId) =>
        getHighlights(catId, itemsPerCategory).catch(() => [] as MLProductFull[])
      )
    )

    // Priorizar variedad no-alimento para que el bloque "mascotas" no quede sesgado.
    const foodRegex = /\b(alimento|comida|balanceado|snack|snacks|lata|pienso|croqueta|nutricion)\b/i
    const buckets = responses.map((products) => products.filter((p) => !foodRegex.test(p.name ?? "")))

    const selected: MLProductFull[] = []
    const seen = new Set<string>()

    let keepLooping = true
    while (keepLooping && selected.length < limit) {
      keepLooping = false
      for (const bucket of buckets) {
        const next = bucket.shift()
        if (!next) continue
        if (!seen.has(next.id)) {
          selected.push(next)
          seen.add(next.id)
        }
        keepLooping = true
        if (selected.length >= limit) break
      }
    }

    // Fallback: completar con cualquier producto destacado si faltan items.
    if (selected.length < limit) {
      for (const products of responses) {
        for (const p of products) {
          if (seen.has(p.id)) continue
          selected.push(p)
          seen.add(p.id)
          if (selected.length >= limit) break
        }
        if (selected.length >= limit) break
      }
    }

    return selected.slice(0, limit)
  } catch (e) {
    console.error("[ML] getPetsHighlights falló:", (e as Error).message?.slice(0, 100))
    return []
  }
}

