import Link from "next/link"
import Image from "next/image"
import type { MLProduct } from "@/lib/mercadolibre"
import { buildAffiliateLink, formatPrice, getDiscount, getHQThumbnail } from "@/lib/ml-utils"
import { renderStars } from "@/lib/utils"
import styles from "./ProductCard.module.css"

interface ProductCardProps {
  product: MLProduct
  badge?: string
  badgeVariant?: "orange" | "green" | "brown"
}

export default function ProductCard({
  product,
  badge,
  badgeVariant = "orange",
}: ProductCardProps) {
  const affiliateLink = buildAffiliateLink(product.permalink)
  const discount = getDiscount(product.price, product.original_price)
  const thumbnail = getHQThumbnail(product.thumbnail)

  return (
    <div className={styles.card}>
      {/* Imagen */}
      <div className={styles.imgWrap}>
        <Image
          src={thumbnail}
          alt={product.title}
          fill
          className={styles.img}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {badge && (
          <span className={`${styles.badge} ${styles[`badge-${badgeVariant}`]}`}>
            {badge}
          </span>
        )}
        {discount && !badge && (
          <span className={`${styles.badge} ${styles["badge-brown"]}`}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className={styles.body}>
        <div className={styles.category}>
          {product.condition === "new" ? "Nuevo" : "Usado"}
          {product.shipping.free_shipping && " · Envío gratis"}
        </div>

        <h3 className={styles.title}>{product.title}</h3>

        {/* Rating */}
        {product.reviews && (
          <div className={styles.rating}>
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
              ({product.reviews.total})
            </span>
          </div>
        )}

        {/* Precio */}
        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            {product.original_price && product.original_price > product.price && (
              <span className={styles.originalPrice}>
                {formatPrice(product.original_price)}
              </span>
            )}
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.btn}
            aria-label={`Ver ${product.title} en Mercado Libre`}
          >
            Ver en ML →
          </a>
        </div>
      </div>
    </div>
  )
}
