"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { MLProductFull } from "@/lib/mercadolibre"
import { formatPrice } from "@/lib/ml-utils"
import styles from "./ProductCard.module.css"

interface Props {
  product: MLProductFull
  badge?:  string
}

export default function ProductCard({ product, badge }: Props) {
  const mainImage = product.pictures[0]?.url ?? ""
  const [imgErr, setImgErr]   = useState(false)

  return (
    <div className={styles.card}>
      {/* Imagen */}
      <Link href={`/producto/${product.id}`} className={styles.imgWrap} tabIndex={-1}>
        {!imgErr && mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.img}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={styles.imgFallback}>🐾</div>
        )}

        {/* Badges sobre la imagen */}
        {badge && <span className={`${styles.badge} ${styles.badgeOrange}`}>{badge}</span>}

        {product.free_shipping && (
          <span className={`${styles.badge} ${styles.badgeGreen} ${styles.badgeBottom}`}>
            Envío gratis
          </span>
        )}
      </Link>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={product.condition === "new" ? styles.tagNew : styles.tagUsed}>
            {product.condition === "new" ? "Nuevo" : "Usado"}
          </span>
          {product.accepts_mercadopago && (
            <span className={styles.tagMP}>MP</span>
          )}
        </div>

        <Link href={`/producto/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            {product.price > 0 ? (
              <span className={styles.price}>{formatPrice(product.price)}</span>
            ) : (
              <span className={styles.priceNA}>Ver precio en ML</span>
            )}
          </div>

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
