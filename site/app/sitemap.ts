import { MetadataRoute } from "next"
import { siteConfig, SLUG_CONFIG } from "@/config/site.config"
import { CATALOGO_ACTUALIZADO } from "@/data/productos-curados"
import { GUIAS } from "@/data/guias"

// Fechas de modificación reales (T35): Google solo usa lastModified si es confiable.
// - Home y categorías: la fecha del último cambio del catálogo (CATALOGO_ACTUALIZADO).
// - Guías: el campo `actualizado` de cada guía (data/guias.ts).
// - Páginas fijas (legales, contacto, sobre Osvaldo): sin fecha, porque no hay una registrada.
// Las fichas /producto/MLA… quedan afuera hasta decidir qué hacer con ellas (T36).
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl  = siteConfig.url
  const catalogo = new Date(CATALOGO_ACTUALIZADO)

  const staticPages = [
    { url: baseUrl,                        priority: 1.0, changeFrequency: "weekly"  as const, lastModified: catalogo },
    { url: `${baseUrl}/sobre-osvaldo`,     priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/privacidad`,        priority: 0.3, changeFrequency: "yearly"  as const },
    { url: `${baseUrl}/terminos`,          priority: 0.3, changeFrequency: "yearly"  as const },
    { url: `${baseUrl}/afiliados`,         priority: 0.3, changeFrequency: "yearly"  as const },
    { url: `${baseUrl}/contacto`,          priority: 0.5, changeFrequency: "yearly"  as const },
  ]

  const categoryPages = Object.keys(SLUG_CONFIG).map((slug) => ({
    url:             `${baseUrl}/categoria/${slug}`,
    priority:        0.9,
    changeFrequency: "weekly" as const,
    lastModified:    catalogo,
  }))

  const guias = Object.entries(GUIAS)
  const ultimaGuia = guias.map(([, g]) => g.actualizado).sort().pop()

  const guiasPages = [
    {
      url: `${baseUrl}/guias`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      ...(ultimaGuia ? { lastModified: new Date(ultimaGuia) } : {}),
    },
    ...guias.map(([slug, g]) => ({
      url: `${baseUrl}/guias/${slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
      lastModified: new Date(g.actualizado),
    })),
  ]

  return [...staticPages, ...categoryPages, ...guiasPages]
}
