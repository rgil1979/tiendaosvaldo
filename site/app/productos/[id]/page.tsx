import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductFromCatalog } from "@/lib/mercadolibre"
import { formatPrice } from "@/lib/ml-utils"
import { siteConfig } from "@/config/site.config"
import styles from "./page.module.css"

// Server-rendered on demand con ISR — evita llamadas a la API de ML durante el build
export const revalidate = 3600

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductFromCatalog(params.id)
    return {
      title: product.name,
      description: product.short_description
        ? product.short_description.slice(0, 155)
        : `${product.name} — disponible en Mercado Libre`,
      openGraph: {
        title: product.name,
        images: product.pictures[0] ? [{ url: product.pictures[0].url }] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function CatalogProductPage({ params }: Props) {
  let product: import("@/lib/mercadolibre").MLProductFull | null = null

  try {
    product = await getProductFromCatalog(params.id)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const mainImage = product.pictures[0]?.url ?? ""

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
            {product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}
          </span>
        </div>
      </div>

      {/* Layout principal */}
      <div className={styles.productPage}>

        {/* Galería de imágenes */}
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

          {/* Miniaturas */}
          {product.pictures.length > 1 && (
            <div className={styles.thumbs}>
              {product.pictures.slice(0, 5).map((pic, i) => (
                <div key={pic.id ?? i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ""}`}>
                  <Image
                    src={pic.url}
                    alt={`${product.name} - imagen ${i + 1}`}
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
              <Image
                src={siteConfig.logo}
                alt="Osvaldo"
                fill
                className={styles.osvaldoNoteAvatarImg}
              />
            </div>
            <div>
              <strong className={styles.osvaldoNoteTitle}>Osvaldo dice:</strong>
              <p className={styles.osvaldoNoteText}>
                Este producto cumple con mis estándares. Disponible con toda la protección al comprador de Mercado Libre.
              </p>
            </div>
          </div>
        </div>

        {/* Info del producto */}
        <div className={styles.productInfo}>

          {/* Tags */}
          <div className={styles.productMeta}>
            <span className={styles.conditionTag}>
              {product.condition === "new" ? "✅ Nuevo" : "🔄 Usado"}
            </span>
            {product.free_shipping && (
              <span className={styles.shippingTag}>🚚 Envío gratis</span>
            )}
            {product.accepts_mercadopago && (
              <span className={styles.mpTag}>💳 Mercado Pago</span>
            )}
          </div>

          {/* Título */}
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
            <div className={styles.warrantyRow}>
              🛡️ <span>{product.warranty}</span>
            </div>
          )}

          {/* Features principales */}
          {product.main_features.length > 0 && (
            <div className={styles.mainFeatures}>
              <h2 className={styles.featuresTitle}>Características principales</h2>
              <ul className={styles.featuresList}>
                {product.main_features.map((feature, i) => (
                  <li key={i} className={styles.featureItem}>
                    <span className={styles.featureDot}>•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
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

          {/* Atributos */}
          {product.attributes.length > 0 && (
            <div className={styles.attrs}>
              <h2 className={styles.attrsTitle}>Ficha técnica</h2>
              <div className={styles.attrsGrid}>
                {product.attributes
                  .filter((a) => a.value_name)
                  .slice(0, 10)
                  .map((attr) => (
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
