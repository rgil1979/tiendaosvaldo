"use client"

import { useState } from "react"
import ProductCard from "@/components/ProductCard"
import type { MLProductFull } from "@/lib/mercadolibre"
import styles from "./ProductCarousel.module.css"

const GAP = 16 // px — debe coincidir con el gap del CSS

interface Props {
  products:      MLProductFull[]
  visibleCount?: number
}

export default function ProductCarousel({ products, visibleCount = 5 }: Props) {
  const [index, setIndex] = useState(0)
  const maxIndex = Math.max(0, products.length - visibleCount)

  const slideWidth = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`
  const offset     = `calc(${index} * (${slideWidth} + ${GAP}px))`

  return (
    <div className={styles.wrap}>
      <button
        className={styles.arrow}
        onClick={() => setIndex((i) => Math.max(0, i - 1))}
        disabled={index === 0}
        aria-label="Anterior"
      >
        ‹
      </button>

      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(calc(-1 * ${offset}))` }}
        >
          {products.map((p) => (
            <div key={p.id} className={styles.slide} style={{ width: slideWidth, minWidth: slideWidth }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.arrow}
        onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
        disabled={index >= maxIndex}
        aria-label="Siguiente"
      >
        ›
      </button>
    </div>
  )
}
