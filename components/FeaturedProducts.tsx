"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { MLProduct } from "@/lib/mercadolibre"
import ProductCard from "./ProductCard"
import styles from "./FeaturedProducts.module.css"

interface Props {
  categoryId: string
  limit?: number
}

export default function FeaturedProducts({ categoryId, limit = 8 }: Props) {
  const [products, setProducts] = useState<MLProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({
      category: categoryId,
      limit: String(limit),
      sort: "relevance",
    })
    fetch(`/api/ml-search?${params}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [categoryId, limit])

  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className={styles.empty}>
        <p>Los productos no están disponibles en este momento. Volvé pronto.</p>
        <Link href="/categoria/mascotas" className="btn btn-ghost">
          Ver categorías →
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          badge={i === 0 ? "Top ventas" : undefined}
        />
      ))}
    </div>
  )
}
