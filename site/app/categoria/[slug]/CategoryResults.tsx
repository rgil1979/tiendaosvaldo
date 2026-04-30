"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import type { MLProductFull } from "@/lib/mercadolibre"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"
import loadingStyles from "@/app/buscar/loading.module.css"

interface Props {
  products:      MLProductFull[]
  page:          number
  totalPages:    number
  slug:          string
  mascotaFilter: string
}

export default function CategoryResults({ products, page, totalPages, slug, mascotaFilter }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function pageHref(p: number) {
    const qs = new URLSearchParams()
    if (p > 1) qs.set("pagina", String(p))
    if (mascotaFilter) qs.set("mascota", mascotaFilter)
    const q = qs.toString()
    return `/categoria/${slug}${q ? `?${q}` : ""}`
  }

  function navigate(p: number) {
    startTransition(() => { router.push(pageHref(p)) })
  }

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))

  return (
    <>
      {isPending ? (
        <div className={loadingStyles.wrap}>
          <div className={loadingStyles.spinner}>
            <div className={loadingStyles.paw}>🐾</div>
            <p className={loadingStyles.text}>Cargando productos...</p>
          </div>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Páginas">
          {page > 1 && (
            <button
              onClick={() => navigate(page - 1)}
              className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
              disabled={isPending}
            >
              ← Anterior
            </button>
          )}

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const n = start + i
            if (n > totalPages) return null
            return (
              <button
                key={n}
                onClick={() => navigate(n)}
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                disabled={isPending}
              >
                {n}
              </button>
            )
          })}

          {page < totalPages && (
            <button
              onClick={() => navigate(page + 1)}
              className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
              disabled={isPending}
            >
              Siguiente →
            </button>
          )}
        </nav>
      )}
    </>
  )
}
