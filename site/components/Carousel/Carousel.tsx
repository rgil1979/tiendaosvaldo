"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import type { MLProductFull } from "@/lib/mercadolibre"
import styles from "./Carousel.module.css"

interface CarouselProps {
  products: MLProductFull[]
  itemsPerView?: 4 | 3 | 2 | 1
  scrollStep?: number
}

export default function Carousel({ products, itemsPerView = 4, scrollStep = 2 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const totalSlides = products.length <= itemsPerView
    ? 1
    : Math.ceil((products.length - itemsPerView) / scrollStep) + 1

  // Auto-scroll cada 5s
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
    // Reanudar auto-play después de 10s
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const handleNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    // Reanudar auto-play después de 10s
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const startIndex = currentIndex * scrollStep
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerView)

  return (
    <div className={styles.carouselContainer}>
      {/* Productos visibles */}
      <div className={styles.carouselContent}>
        <div className={`${styles.grid} ${styles[`grid${itemsPerView}`]}`}>
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      {totalSlides > 1 && (
        <div className={styles.controls}>
          {/* Botón prev */}
          <button
            onClick={handlePrev}
            className={styles.btn}
            aria-label="Productos anteriores"
            title="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18l-6-6 6-6"></polyline>
            </svg>
          </button>

          {/* Indicadores (dots) */}
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

          {/* Botón next */}
          <button
            onClick={handleNext}
            className={styles.btn}
            aria-label="Próximos productos"
            title="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18l6-6-6-6"></polyline>
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}
