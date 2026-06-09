import { cache } from "react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct } from "@/lib/mercadolibre"
import { formatPrice } from "@/lib/ml-utils"
import { siteConfig, SLUG_CONFIG } from "@/config/site.config"
import BuyButton from "@/components/BuyButton/BuyButton"
import styles from "./page.module.css"

export const revalidate = 3600

const getProductCached = cache(getProduct)

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const p = await getProductCached(id)

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.short_description ?? p.name,
      image: p.pictures.map((pic: { url: string }) => pic.url),
      offers: {
        "@type": "Offer",
        url: `${siteConfig.url}/producto/${id}`,
        priceCurrency: "ARS",
        price: p.price,
        availability: "https://schema.org/InStock",
        itemCondition: p.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
      },
    }

    const categorySlug = Object.entries(SLUG_CONFIG).find(
      ([, cfg]) => cfg.domainId === p.domain_id
    )?.[0] ?? "mascotas"

    const categoryLabel = SLUG_CONFIG[categorySlug]?.label ?? "Mascotas"

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: categoryLabel, item: `${siteConfig.url}/categoria/${categorySlug}` },
        { "@type": "ListItem", position: 3, name: p.name, item: `${siteConfig.url}/producto/${id}` },
      ],
    }

    return {
      title:       p.name,
      description: p.short_description?.slice(0, 155) || `${p.name} - disponible en Mercado Libre`,
      robots:      { index: true, follow: true },
      openGraph: {
        title:  p.name,
        images: p.pictures[0] ? [{ url: p.pictures[0].url }] : [],
      },
      other: {
        "script:ld+json":            JSON.stringify(productSchema),
        "script:ld+json:breadcrumb": JSON.stringify(breadcrumbSchema),
      },
    }
  } catch {
    return { robots: { index: false, follow: false } }
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  let product: Awaited<ReturnType<typeof getProduct>> | null = null

  try {
    product = await getProductCached(id)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const mainImage = product.pictures[0]?.url ?? ""

  const relevantAttrs = product.attributes
    .filter((a) => a.value_name && !["GTIN", "SELLER_SKU"].includes(a.id))
    .slice(0, 10)

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/">Inicio</Link>
          <span>&rsaquo;</span>
          <Link href="/categoria/mascotas">Mascotas</Link>
          <span>&rsaquo;</span>
          <span className={styles.breadcrumbCurrent}>
            {product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}
          </span>
        </div>
      </div>

      {/* Layout producto */}
      <div className={styles.productPage}>

        {/* Galeria */}
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className={styles.galleryImg}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className={styles.galleryFallback}>🐾</div>
            )}
          </div>

          {product.pictures.length > 1 && (
            <div className={styles.thumbs}>
              {product.pictures.slice(0, 5).map((pic, i) => (
                <div key={pic.id ?? i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ""}`}>
                  <Image
                    src={pic.url}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className={styles.thumbImg}
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Nota de Osvaldo */}
          <div className={styles.osvaldoNote}>
            <div className={styles.osvaldoNoteAvatar}>
              <Image src={siteConfig.logo} alt="Osvaldo" fill className={styles.osvaldoNoteAvatarImg} />
            </div>
            <div>
              <strong className={styles.osvaldoNoteTitle}>✔ Osvaldo lo recomienda</strong>
              <p className={styles.osvaldoNoteText}>
                Producto disponible con toda la proteccion al comprador de Mercado Libre.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={styles.productInfo}>

          {/* Tags */}
          <div className={styles.productMeta}>
            <span className={product.condition === "new" ? styles.tagNew : styles.tagUsed}>
              {product.condition === "new" ? "✅ Nuevo" : "🔄 Usado"}
            </span>
            {product.free_shipping && (
              <span className={styles.tagShipping}>🚚 Envio gratis</span>
            )}
            {product.accepts_mercadopago && (
              <span className={styles.tagMP}>💳 Mercado Pago</span>
            )}
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.divider} />

          {/* Precio */}
          {product.price > 0 && (
            <div className={styles.priceBlock}>
              <div className={styles.price}>{formatPrice(product.price)}</div>
            </div>
          )}

          {/* Garantia */}
          {product.warranty && (
            <div className={styles.warrantyRow}>🛡️ {product.warranty}</div>
          )}

          {/* Features principales */}
          {product.main_features.length > 0 && (
            <div className={styles.mainFeatures}>
              <h2 className={styles.featuresTitle}>Caracteristicas principales</h2>
              <ul className={styles.featuresList}>
                {product.main_features.map((feat, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✔</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA principal */}
          <div className={styles.ctaBlock}>
            <BuyButton
              href={product.affiliateUrl}
              productId={product.id}
              productName={product.name}
              className={styles.btnML}
            >
              Comprar en Mercado Libre →
            </BuyButton>
          </div>
          <p className={styles.mlDisclaimer}>
            Al hacer clic seras redirigido a Mercado Libre donde se completa la compra.{" "}
            <Link href="/sobre-osvaldo#como-funciona">¿Como funciona?</Link>
          </p>

          {/* Descripcion */}
          {product.short_description && (
            <div className={styles.description}>
              <h2 className={styles.descTitle}>Descripcion</h2>
              <p className={styles.descText}>{product.short_description}</p>
            </div>
          )}

          {/* Tabla de atributos */}
          {relevantAttrs.length > 0 && (
            <div className={styles.attrs}>
              <h2 className={styles.attrsTitle}>Ficha tecnica</h2>
              <div className={styles.attrsGrid}>
                {relevantAttrs.map((attr) => (
                  <div key={attr.id} className={styles.attrRow}>
                    <span className={styles.attrKey}>{attr.name}</span>
                    <span className={styles.attrVal}>{attr.value_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}