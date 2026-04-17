"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { MLProduct } from "@/lib/mercadolibre"
import ProductCard from "./ProductCard"
import styles from "./CategoryProducts.module.css"

interface Props {
  categoryId: string
  slug: string
  limit: number
  offset: number
  sort: string
  priceMin?: number
  priceMax?: number
}

interface Paging {
  total: number
  offset: number
  limit: number
}

export default function CategoryProducts({
  categoryId,
  slug,
  limit,
  offset,
  sort,
  priceMin,
  priceMax,
}: Props) {
  const [products, setProducts] = useState<MLProduct[]>([])
  const [paging, setPaging] = useState<Paging>({ total: 0, offset, limit })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams({
      category: categoryId,
      limit: String(limit),
      offset: String(offset),
      sort,
    })
    if (priceMin) params.set("priceMin", String(priceMin))
    if (priceMax) params.set("priceMax", String(priceMax))

    fetch(`/api/ml-search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.results ?? [])
        if (data.paging) setPaging(data.paging)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [categoryId, limit, offset, sort, priceMin, priceMax])

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(paging.total / limit)

  function pageHref(p: number) {
    const qs = new URLSearchParams({ orden: sort })
    if (priceMin) qs.set("precioMin", String(priceMin))
    if (priceMax) qs.set("precioMax", String(priceMax))
    qs.set("pagina", String(p))
    return `/categoria/${slug}?${qs.toString()}`
  }

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
        {paging.total === 0 ? (
          <>
            <p>Los productos no están disponibles en este momento. Volvé más tarde.</p>
            <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
          </>
        ) : (
          <>
            <p>No encontramos productos. Probá con otros filtros.</p>
            <Link href={`/categoria/${slug}`} className="btn btn-ghost">Limpiar filtros</Link>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={pageHref(page - 1)} className={`${styles.pageBtn} ${styles.pageBtnArrow}`}>
              ← Anterior
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className={`${styles.pageBtn} ${styles.pageBtnArrow}`}>
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </>
  )
}
