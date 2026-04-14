import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getProduct,
  getProductDescription,
  searchProducts,
  buildAffiliateLink,
  formatPrice,
  getDiscount,
  getHQThumbnail,
} from "@/lib/mercadolibre"
import { renderStars } from "@/lib/utils"
import { siteConfig } from "@/config/site.config"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProduct(params.id)
    return {
      title: product.title,
      description: `${product.title} — Disponible en Mercado Libre. ${formatPrice(product.price)}`,
      openGraph: {
        images: [{ url: getHQThumbnail(product.thumbnail) }],
      },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: Props) {
  let product: import("@/lib/mercadolibre").MLProduct | null = null
  let description: { plain_text: string } | null = null
  let related: import("@/lib/mercadolibre").MLProduct[] = []

  try {
    product = await getProduct(params.id)
    description = await getProductDescription(params.id)
    const relatedResult = await searchProducts({
      categoryId: product.category_id,
      limit: 4,
    })
    related = relatedResult.results.filter((p) => p.id !== params.id).slice(0, 4)
  } catch {
    notFound()
  }

  if (!product) notFound()

  const affiliateLink = buildAffiliateLink(product.permalink)
  const discount = getDiscount(product.price, product.original_price)
  const thumbnail = getHQThumbnail(product.thumbnail)
  const pictures = product.pictures || [{ url: thumbnail }]

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
            {product.title.length > 40 ? `${product.title.slice(0, 40)}...` : product.title}
          </span>
        </div>
      </div>

      {/* Producto */}
      <div className={styles.productPage}>

        {/* Galería */}
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            {discount && (
              <span className={styles.galleryBadge}>{discount}% OFF</span>
            )}
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              className={styles.galleryImg}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnails */}
          {pictures.length > 1 && (
            <div className={styles.thumbs}>
              {pictures.slice(0, 4).map((pic, i) => (
                <div key={i} className={`${styles.thumb} ${i === 0 ? styles.thumbActive : ""}`}>
                  <Image
                    src={getHQThumbnail(pic.url)}
                    alt={`${product.title} - imagen ${i + 1}`}
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
                Este producto cumple con mis estándares. Vendedor con reputación verde y buenas calificaciones de compradores reales.
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className={styles.productInfo}>

          {/* Tags */}
          <div className={styles.productMeta}>
            <span className={styles.conditionTag}>
              {product.condition === "new" ? "✅ Nuevo" : "🔄 Usado"}
            </span>
            {product.shipping.free_shipping && (
              <span className={styles.shippingTag}>🚚 Envío gratis</span>
            )}
          </div>

          {/* Título */}
          <h1 className={styles.productTitle}>{product.title}</h1>

          {/* Rating */}
          {product.reviews && (
            <div className={styles.productRating}>
              <span
                className={styles.stars}
                aria-label={`${product.reviews.rating_average.toFixed(1)} de 5 estrellas`}
              >
                {renderStars(product.reviews.rating_average)}
              </span>
              <span className={styles.ratingNum}>
                {product.reviews.rating_average.toFixed(1)}
              </span>
              <span className={styles.ratingCount}>
                ({product.reviews.total} calificaciones)
              </span>
            </div>
          )}

          <div className={styles.divider} />

          {/* Precio */}
          <div className={styles.priceBlock}>
            {product.original_price && product.original_price > product.price && (
              <div className={styles.originalPrice}>
                {formatPrice(product.original_price)}
              </div>
            )}
            <div className={styles.price}>{formatPrice(product.price)}</div>
            {discount && (
              <span className={styles.discountBadge}>✓ {discount}% OFF</span>
            )}
            {product.installments && (
              <div className={styles.installments}>
                o{" "}
                <strong>
                  {product.installments.quantity} cuotas sin interés de{" "}
                  {formatPrice(product.installments.amount)}
                </strong>{" "}
                con Mercado Pago
              </div>
            )}
          </div>

          {/* Stock */}
          {product.available_quantity > 0 ? (
            <div className={styles.stockOk}>
              <div className={styles.stockDot} />
              <span>Stock disponible</span>
            </div>
          ) : (
            <div className={styles.stockOut}>Sin stock</div>
          )}

          {/* Features */}
          <div className={styles.features}>
            {[
              { icon: "🚚", title: "Envío gratis", desc: "Mercado Envíos" },
              { icon: "🔄", title: "Devolución gratis", desc: "30 días" },
              { icon: "🛡️", title: "Compra protegida", desc: "Por Mercado Libre" },
              { icon: "💳", title: "Cuotas sin interés", desc: "Con tarjetas seleccionadas" },
            ].map((f) => (
              <div key={f.title} className={styles.feature}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className={styles.ctaBlock}>
            <a
              href={affiliateLink}
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

          {/* Vendedor */}
          {product.seller && (
            <div className={styles.sellerCard}>
              <div className={styles.sellerHeader}>
                <div className={styles.sellerAvatar}>🏪</div>
                <div>
                  <strong className={styles.sellerName}>
                    {product.seller.nickname}
                  </strong>
                  <span className={styles.sellerSub}>Vendedor en Mercado Libre</span>
                </div>
                <div className={styles.sellerRep}>🟢 Reputación verde</div>
              </div>
            </div>
          )}

          {/* Descripción */}
          {description?.plain_text && (
            <div className={styles.description}>
              <h2 className={styles.descTitle}>Descripción</h2>
              <p className={styles.descText}>
                {description.plain_text.slice(0, 500)}
                {description.plain_text.length > 500 ? "..." : ""}
              </p>
            </div>
          )}

          {/* Atributos */}
          {product.attributes && product.attributes.length > 0 && (
            <div className={styles.attrs}>
              <h2 className={styles.attrsTitle}>Características</h2>
              <div className={styles.attrsGrid}>
                {product.attributes.slice(0, 8).map((attr) => (
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

      {/* Productos relacionados */}
      {related.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>
              También te puede <span>interesar</span>
            </h2>
            <Link href="/categoria/mascotas" className={styles.seeAll}>
              Ver más →
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
