// ─────────────────────────────────────────────
// CLIENTE API — MERCADO LIBRE
// Todas las llamadas a la API de ML pasan por acá
// ─────────────────────────────────────────────

import { mlConfig } from "@/config/site.config"

// ── TIPOS ──────────────────────────────────────

export interface MLProduct {
  id: string
  title: string
  price: number
  original_price: number | null
  currency_id: string
  available_quantity: number
  condition: "new" | "used"
  thumbnail: string
  pictures?: { url: string }[]
  permalink: string
  seller: {
    id: number
    nickname: string
    seller_reputation?: {
      level_id: string
      power_seller_status: string | null
    }
  }
  shipping: {
    free_shipping: boolean
  }
  installments?: {
    quantity: number
    amount: number
    currency_id: string
  }
  attributes?: { id: string; name: string; value_name: string }[]
  description?: string
  category_id: string
  reviews?: {
    rating_average: number
    total: number
  }
}

export interface MLSearchResult {
  results: MLProduct[]
  paging: {
    total: number
    offset: number
    limit: number
    primary_results: number
  }
  filters: MLFilter[]
  available_filters: MLFilter[]
}

export interface MLFilter {
  id: string
  name: string
  values: { id: string; name: string; results: number }[]
}

export interface MLCategory {
  id: string
  name: string
  total_items_in_this_category: number
  children_categories: { id: string; name: string; total_items_in_this_category: number }[]
}

// ── UTILIDADES PURAS (re-exportadas desde ml-utils para compatibilidad) ────

export { buildAffiliateLink, formatPrice, getDiscount, getHQThumbnail } from "./ml-utils"

// ── AUTENTICACIÓN OAuth2 (client_credentials) ──

interface MLToken {
  access_token: string
  expiresAt: number
}

// Cache en memoria — válido mientras corre el proceso Node.js (tokens duran ~6h en ML)
let _tokenCache: MLToken | null = null

async function getAccessToken(): Promise<string | null> {
  const appId = mlConfig.appId
  const clientSecret = mlConfig.clientSecret
  const refreshToken = mlConfig.refreshToken

  if (!appId || !clientSecret) return null

  // Devolver token cacheado si no expiró (5 min de margen)
  if (_tokenCache && Date.now() < _tokenCache.expiresAt) {
    return _tokenCache.access_token
  }

  // Preferir refresh_token (token de usuario) sobre client_credentials (token de app)
  // El token de usuario tiene más permisos sobre el catálogo de ML
  const body = refreshToken
    ? new URLSearchParams({
        grant_type: "refresh_token",
        client_id: appId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      })
    : new URLSearchParams({
        grant_type: "client_credentials",
        client_id: appId,
        client_secret: clientSecret,
      })

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  })

  if (!res.ok) {
    console.warn(`[ML] Error al obtener access token: ${res.status} ${res.statusText}`)
    return null
  }

  const data = await res.json()
  _tokenCache = {
    access_token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  }

  console.log(`[ML] Access token obtenido (${refreshToken ? "refresh_token" : "client_credentials"}).`)
  return _tokenCache.access_token
}

// ── CLIENTE BASE ────────────────────────────────

// Retry con backoff exponencial para manejar rate limiting (429) de ML.
// 403 no se reintenta — es un rechazo definitivo.
async function mlFetch<T>(endpoint: string, options?: RequestInit, attempt = 1): Promise<T> {
  const url = `${mlConfig.apiBaseUrl}${endpoint}`
  const MAX_ATTEMPTS = 3

  const token = await getAccessToken()

  const res = await fetch(url, {
    ...options,
    next: { revalidate: mlConfig.cache.productsTTL },
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "TiendaOsvaldo/1.0 (tiendaosvaldo.com.ar)",
      "Accept": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  // 401 con token = token vencido antes de lo esperado, limpiamos cache y reintentamos una vez
  if (res.status === 401 && token && attempt === 1) {
    _tokenCache = null
    return mlFetch<T>(endpoint, options, attempt + 1)
  }

  // 403 definitivo — no reintentamos
  if (res.status === 403) {
    console.warn(`[ML] 403 Forbidden en ${url} — verificá las credenciales en .env.local`)
    throw new Error(`ML_FORBIDDEN: ${url}`)
  }

  if (res.status === 429 && attempt < MAX_ATTEMPTS) {
    const delay = Math.pow(2, attempt) * 500
    await new Promise((r) => setTimeout(r, delay))
    return mlFetch<T>(endpoint, options, attempt + 1)
  }

  if (!res.ok) {
    throw new Error(`ML API error: ${res.status} ${res.statusText} — ${url}`)
  }

  return res.json()
}

// ── RESULTADO VACÍO SEGURO ──────────────────────

function emptySearchResult(limit: number, offset: number): MLSearchResult {
  return {
    results: [],
    paging: { total: 0, offset, limit, primary_results: 0 },
    filters: [],
    available_filters: [],
  }
}

// ── BÚSQUEDA DE PRODUCTOS ───────────────────────

export async function searchProducts(params: {
  categoryId: string
  limit?: number
  offset?: number
  sort?: string
  priceMin?: number
  priceMax?: number
  condition?: string
}): Promise<MLSearchResult> {
  const {
    categoryId,
    limit = mlConfig.search.defaultLimit,
    offset = 0,
    sort = mlConfig.search.defaultSort,
    priceMin,
    priceMax,
    condition = mlConfig.search.condition,
  } = params

  const query = new URLSearchParams({
    category: categoryId,
    limit: limit.toString(),
    offset: offset.toString(),
    sort,
    ...(condition !== "all" && { condition }),
    ...(priceMin && { price: `${priceMin}-*` }),
    ...(priceMax && !priceMin && { price: `*-${priceMax}` }),
    ...(priceMin && priceMax && { price: `${priceMin}-${priceMax}` }),
  })

  try {
    return await mlFetch<MLSearchResult>(
      `/sites/${mlConfig.siteId}/search?${query}`,
      { next: { revalidate: mlConfig.cache.categoryTTL } }
    )
  } catch (e) {
    console.warn("[ML] searchProducts falló — retornando resultado vacío.", (e as Error).message)
    return emptySearchResult(limit, offset)
  }
}

// ── DETALLE DE PRODUCTO ─────────────────────────

export async function getProduct(id: string): Promise<MLProduct> {
  return mlFetch<MLProduct>(
    `/items/${id}`,
    { next: { revalidate: mlConfig.cache.productDetailTTL } }
  )
}

// ── DESCRIPCIÓN DE PRODUCTO ─────────────────────

export async function getProductDescription(id: string): Promise<{ plain_text: string }> {
  return mlFetch<{ plain_text: string }>(
    `/items/${id}/description`,
    { next: { revalidate: mlConfig.cache.productDetailTTL } }
  )
}

// ── INFORMACIÓN DE CATEGORÍA ────────────────────

export async function getCategory(categoryId: string): Promise<MLCategory> {
  return mlFetch<MLCategory>(
    `/categories/${categoryId}`,
    { next: { revalidate: 86400 } } // 24 horas
  )
}

// ── PRODUCTOS DESTACADOS (HOME) ─────────────────

export async function getFeaturedProducts(limit = 8): Promise<MLProduct[]> {
  try {
    const result = await searchProducts({
      categoryId: mlConfig.categories.mascotas,
      limit,
      sort: "relevance",
    })
    return result.results
  } catch (e) {
    console.warn("[ML] getFeaturedProducts falló — retornando array vacío.", (e as Error).message)
    return []
  }
}

// ── PRODUCTOS MÁS VENDIDOS ──────────────────────

export async function getTopSellingProducts(categoryId: string, limit = 8): Promise<MLProduct[]> {
  try {
    const result = await searchProducts({
      categoryId,
      limit,
      sort: "relevance",
    })
    return result.results
  } catch (e) {
    console.warn("[ML] getTopSellingProducts falló — retornando array vacío.", (e as Error).message)
    return []
  }
}

