// Utilidades puras de Mercado Libre — sin dependencias server-side.
// Seguro para importar en client components.

export function buildAffiliateLink(permalink: string): string {
  try {
    const url = new URL(permalink)
    const affiliateId = process.env.NEXT_PUBLIC_ML_AFFILIATE_ID
    if (affiliateId) {
      url.searchParams.set("partner_id", affiliateId)
    }
    url.searchParams.set("utm_source", "tiendaosvaldo")
    url.searchParams.set("utm_medium", "affiliate")
    return url.toString()
  } catch {
    return permalink
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getDiscount(price: number, originalPrice: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function getHQThumbnail(thumbnail: string): string {
  if (!thumbnail) return ""
  const hq = thumbnail.replace(/(-I|-I\.jpg|I\.jpg)$/, (match) =>
    match.includes("-I") ? match.replace("-I", "-O") : match.replace("I", "O")
  )
  return hq !== thumbnail ? hq : thumbnail
}
