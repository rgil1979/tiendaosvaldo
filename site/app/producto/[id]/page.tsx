import { cache } from "react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct } from "@/lib/mercadolibre"
import { formatPrice } from "@/lib/ml-utils"
import { siteConfig } from "@/config/site.config"
import styles from "./page.module.css"

// Server-rendered on demand con ISR de 1 hora
export const revalidate = 3600

// cache() deduplica: generateMetadata y la página comparten el mismo fetch dentro del mismo request
const getProductCached = cache(getProduct)

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await getProductCached(params.id)
    return {
      title:       p.name,
      description: p.short_description?.slice(0, 155) ||
        `${p.name} — disponible en Mercado Libre`,
      openGraph: {
        title:  p.name,
        images: p.pictures[0] ? [{ url: p.pictures[0].url }] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: Props) {
  let product: Awaited<ReturnType<typeof getProduct>> | null = null

  try {
    product = await getProductCached(params.id)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const mainImage = product.pictures[0]?.url ?? ""

  // Atributos a mostrar en la tabla (filtra los que tienen valor)
  const relevantAttrs = product.attributes
    .filter((a) => a.value_name && !["GTIN", "SELLER_SKU"].includes(a.id))
    .slice(0, 10)

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/">Inicio</Link>
          <span>›</span>
          <Link href="/categoria/mascotas">Mascotas</Link>
          <span>›</span>
          <span className={styles.breadcrumbCurrent}>
            {product.name.length > 50 ? `${product.name.slice(0, 50)}…` : product.name}
          </span>
        </div>
      </div>

      {/* Layout producto */}
      <div className={styles.productPage}>

        {/* Galería */}
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
              <strong className={styles.osvaldoNoteTitle}>✓ Osvaldo lo recomienda</strong>
              <p className={styles.osvaldoNoteText}>
                Producto disponible con toda la protección al comprador de Mercado Libre.
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
              <span className={styles.tagShipping}>🚚 Envío gratis</span>
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

          {/* Garantía */}
          {product.warranty && (
            <div className={styles.warrantyRow}>🛡️ {product.warranty}</div>
          )}

          {/* Features principales */}
          {product.main_features.length > 0 && (
            <div className={styles.mainFeatures}>
              <h2 className={styles.featuresTitle}>Características principales</h2>
              <ul className={styles.featuresList}>
                {product.main_features.map((feat, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA principal */}
          <div className={styles.ctaBlock}>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={styles.btnML}
            >
              Comprar en Mercado Libre →
            </a>
          </div>
          <p className={styles.mlDisclaimer}>
            Al hacer clic serás redirigido a Mercado Libre donde se completa la compra.{" "}
            <Link href="/sobre-osvaldo#como-funciona">¿Cómo funciona?</Link>
          </p>

          {/* Descripción */}
          {product.short_description && (
            <div className={styles.description}>
              <h2 className={styles.descTitle}>Descripción</h2>
              <p className={styles.descText}>{product.short_description}</p>
            </div>
          )}

          {/* Tabla de atributos */}
          {relevantAttrs.length > 0 && (
            <div className={styles.attrs}>
              <h2 className={styles.attrsTitle}>Ficha técnica</h2>
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
