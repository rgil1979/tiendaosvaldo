"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import type { MLProductFull } from "@/lib/mercadolibre"
import styles from "./CarouselGatos.module.css"

interface CarouselGatosProps {
  products: MLProductFull[]
  itemsPerView?: 4 | 3 | 2 | 1
  scrollStep?: number
  alwaysShowItemsPerView?: boolean
}

export default function CarouselGatos({
  products,
  itemsPerView = 4,
  scrollStep = 2,
  alwaysShowItemsPerView = false,
}: CarouselGatosProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const totalSlides = products.length <= itemsPerView
    ? 1
    : Math.ceil((products.length - itemsPerView) / scrollStep) + 1

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay, totalSlides])

  const handlePrev = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const handleNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const startIndex = currentIndex * scrollStep
  const visibleProductsBase = products.slice(startIndex, startIndex + itemsPerView)
  const visibleProducts = alwaysShowItemsPerView && visibleProductsBase.length < itemsPerView
    ? [
        ...visibleProductsBase,
        ...products.slice(0, itemsPerView - visibleProductsBase.length),
      ]
    : visibleProductsBase

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselContent}>
        <div
          className={`${styles.grid} ${styles[`grid${itemsPerView}`]} ${
            alwaysShowItemsPerView ? styles.fixedView : ""
          }`}
        >
          {visibleProducts.map((p, i) => (
            <ProductCard key={`${p.id}-${i}`} product={p} />
          ))}
        </div>
      </div>

      {totalSlides > 1 && (
        <div className={styles.controls}>
          <button
            onClick={handlePrev}
            className={styles.btn}
            aria-label="Productos anteriores"
            title="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className={styles.dots}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setAutoPlay(false)
                  setCurrentIndex(i)
                  setTimeout(() => setAutoPlay(true), 10000)
                }}
                className={`${styles.dot} ${i === currentIndex ? styles.active : ""}`}
                aria-label={`Ir a slide ${i + 1}`}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className={styles.btn}
            aria-label="Próximos productos"
            title="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}
