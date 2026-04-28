import { MetadataRoute } from "next"
import { siteConfig, SLUG_CONFIG } from "@/config/site.config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const now     = new Date()

  const staticPages = [
    { url: baseUrl,                        priority: 1.0, changeFrequency: "daily"   as const, lastModified: now },
    { url: `${baseUrl}/sobre-osvaldo`,     priority: 0.8, changeFrequency: "monthly" as const, lastModified: now },
    { url: `${baseUrl}/privacidad`,        priority: 0.3, changeFrequency: "yearly"  as const, lastModified: now },
    { url: `${baseUrl}/terminos`,          priority: 0.3, changeFrequency: "yearly"  as const, lastModified: now },
    { url: `${baseUrl}/afiliados`,         priority: 0.3, changeFrequency: "yearly"  as const, lastModified: now },
    { url: `${baseUrl}/contacto`,          priority: 0.5, changeFrequency: "yearly"  as const, lastModified: now },
  ]

  const categoryPages = Object.keys(SLUG_CONFIG).map((slug) => ({
    url:             `${baseUrl}/categoria/${slug}`,
    priority:        0.9,
    changeFrequency: "daily" as const,
    lastModified:    now,
  }))

  return [...staticPages, ...categoryPages]
}
