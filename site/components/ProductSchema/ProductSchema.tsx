import { siteConfig } from "@/config/site.config"

interface Props {
  product: {
    id: string
    name: string
    price: number
    condition: string
    pictures: { url: string }[]
    attributes: { id: string; name: string; value_name: string | null }[]
    warranty?: string | null
    short_description?: string | null
    affiliateUrl: string
  }
}

export default function ProductSchema({ product }: Props) {
  const brand = product.attributes.find(
    (a) => a.id === "BRAND"
  )?.value_name

  const mpn = product.attributes.find(
    (a) => a.id === "MPN" || a.id === "MODEL"
  )?.value_name

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.name,
    image: product.pictures.map((p) => p.url),
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
    ...(mpn && { mpn }),
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/producto/${product.id}`,
      priceCurrency: "ARS",
      price: product.price,
      availability:
        "https://schema.org/InStock",
      itemCondition:
        product.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    ...(product.warranty != null && { warranty: product.warranty }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}