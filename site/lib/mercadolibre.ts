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

// ── GENERADOR DE LINKS DE AFILIADO ─────────────

export function buildAffiliateLink(permalink: string): string {
  const url = new URL(permalink)
  url.searchParams.set("partner_id", mlConfig.affiliateId)
  url.searchParams.set("utm_source", "tiendaosvaldo")
  url.searchParams.set("utm_medium", "affiliate")
  return url.toString()
}

// ── CLIENTE BASE ────────────────────────────────

async function mlFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${mlConfig.apiBaseUrl}${endpoint}`

  const res = await fetch(url, {
    ...options,
    next: { revalidate: mlConfig.cache.productsTTL },
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`ML API error: ${res.status} ${res.statusText} — ${url}`)
  }

  return res.json()
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

  return mlFetch<MLSearchResult>(
    `/sites/${mlConfig.siteId}/search?${query}`,
    { next: { revalidate: mlConfig.cache.categoryTTL } }
  )
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
  const result = await searchProducts({
    categoryId: mlConfig.categories.mascotas,
    limit,
    sort: "relevance",
  })
  return result.results
}

// ── PRODUCTOS MÁS VENDIDOS ──────────────────────

export async function getTopSellingProducts(categoryId: string, limit = 8): Promise<MLProduct[]> {
  const result = await searchProducts({
    categoryId,
    limit,
    sort: "relevance",
  })
  return result.results
}

// ── FORMATEO DE PRECIO ──────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ── DESCUENTO ───────────────────────────────────

export function getDiscount(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// ── THUMBNAIL DE ALTA CALIDAD ───────────────────

export function getHQThumbnail(thumbnail: string): string {
  return thumbnail.replace("I.jpg", "O.jpg").replace("-I.jpg", "-O.jpg")
}
