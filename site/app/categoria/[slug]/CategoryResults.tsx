"use client"

import type { ProductoCurado } from "@/data/productos-curados"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"
import paginationStyles from "./pagination.module.css"

type MascotaFilter = "perro" | "gato"

interface Props {
  products:       ProductoCurado[]
  totalFiltered:  number
  page:           number
  totalPages:     number
  mascotasFiltro: Set<MascotaFilter>
  limpiarFiltros: () => void
  onPageChange:   (page: number) => void
}

export default function CategoryResults({
  products,
  totalFiltered,
  page,
  totalPages,
  mascotasFiltro,
  limpiarFiltros,
  onPageChange,
}: Props) {
  const hayFiltrosActivos = mascotasFiltro.size > 0

  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => start + i
  ).filter(n => n <= totalPages)

  function handlePageChange(p: number) {
    onPageChange(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {hayFiltrosActivos && (
        <p className={paginationStyles.resultsInfo}>
          {totalFiltered} {totalFiltered === 1 ? "producto" : "productos"}
          {" · "}
          {Array.from(mascotasFiltro).map(m => m === "perro" ? "🐕 Perro" : "🐈 Gato").join(" + ")}
        </p>
      )}

      {products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id:                  p.id,
                name:                p.titulo,
                pictures:            [{ id: "0", url: p.imagen }],
                affiliateUrl:        p.linkAfiliado,
                price:               0,
                condition:           "new" as const,
                free_shipping:       false,
                accepts_mercadopago: false,
                currency_id:         "ARS",
                short_description:   "",
                main_features:       [],
                attributes:          [],
                domain_id:           "",
                status:              "active",
                item_id:             p.id,
                warranty:            null,
              }}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span>🐾</span>
          <p>No hay productos para ese filtro.</p>
          <button className="btn btn-ghost" onClick={limpiarFiltros}>
            Ver todos
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <nav className={paginationStyles.pagination} aria-label="Páginas">
          <button
            className={`${paginationStyles.pageBtn} ${paginationStyles.pageBtnArrow}`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            ←
          </button>

          {pageNumbers.map(n => (
            <button
              key={n}
              onClick={() => handlePageChange(n)}
              className={`${paginationStyles.pageBtn} ${n === page ? paginationStyles.pageBtnActive : ""}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}

          <button
            className={`${paginationStyles.pageBtn} ${paginationStyles.pageBtnArrow}`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Página siguiente"
          >
            →
          </button>
        </nav>
      )}
    </>
  )
}
