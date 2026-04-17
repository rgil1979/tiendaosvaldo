import { MetadataRoute } from "next"
import { siteConfig } from "@/config/site.config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${baseUrl}/sobre-osvaldo`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/privacidad`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/terminos`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/afiliados`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/contacto`, priority: 0.5, changeFrequency: "yearly" as const },
  ]

  const categories = ["mascotas","perros","gatos","accesorios","alimentacion","juguetes"]
  const categoryPages = categories.map((slug) => ({
    url: `${baseUrl}/categoria/${slug}`,
    priority: 0.9,
    changeFrequency: "daily" as const,
  }))

  return [...staticPages, ...categoryPages]
}
