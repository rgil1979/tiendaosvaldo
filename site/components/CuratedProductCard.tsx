"use client"

import { useState } from "react"
import type { MLProductFull } from "@/lib/mercadolibre"
import { formatPrice } from "@/lib/ml-utils"
import styles from "./CuratedProductCard.module.css"

interface Props {
  product: MLProductFull
}

export default function CuratedProductCard({ product }: Props) {
  const mainImage = product.pictures[0]?.url ?? ""
  const [imgError, setImgError] = useState(false)

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        {!imgError && mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={product.name}
            className={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.imgFallback}>🐾</div>
        )}

        <span className={`${styles.badge} ${product.condition === "new" ? styles.badgeNew : styles.badgeUsed}`}>
          {product.condition === "new" ? "Nuevo" : "Usado"}
        </span>

        {product.free_shipping && (
          <span className={styles.shippingBadge}>Envío gratis</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>

        {product.warranty && (
          <p className={styles.warranty}>{product.warranty}</p>
        )}

        <div className={styles.footer}>
          {product.price > 0 ? (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          ) : (
            <span className={styles.priceUnavailable}>Ver precio</span>
          )}

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={styles.btn}
            aria-label={`Ver ${product.name} en Mercado Libre`}
          >
            Ver en ML →
          </a>
        </div>
      </div>
    </div>
  )
}
