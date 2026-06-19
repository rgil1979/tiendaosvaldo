"use client"

import { useState, useMemo } from "react"
import type { ProductoCurado } from "@/data/productos-curados"
import CategoryTree from "./CategoryTree"
import CategoryResults from "./CategoryResults"
import styles from "./page.module.css"

type MascotaFilter = "perro" | "gato"

interface Category {
  slug: string
  name: string
  children?: Category[]
}

interface Props {
  products:       ProductoCurado[]
  treeCategories: Category[]
  currentSlug:    string
}

const PAGE_SIZE = 12

export default function CategoryPageClient({
  products,
  treeCategories,
  currentSlug,
}: Props) {
  const [mascotasFiltro, setMascotasFiltro] = useState<Set<MascotaFilter>>(new Set())
  const [page, setPage] = useState(1)

  const counts = useMemo(() => ({
    perro: products.filter(p => p.mascota === "perro").length,
    gato:  products.filter(p => p.mascota === "gato").length,
  }), [products])

  const productosFiltrados = useMemo(() => {
    if (mascotasFiltro.size === 0) return products
    return products.filter(p => mascotasFiltro.has(p.mascota as MascotaFilter))
  }, [products, mascotasFiltro])

  const totalPages = Math.ceil(productosFiltrados.length / PAGE_SIZE)

  const productosPagina = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return productosFiltrados.slice(start, start + PAGE_SIZE)
  }, [productosFiltrados, page])

  function toggleMascota(mascota: MascotaFilter) {
    setMascotasFiltro(prev => {
      const next = new Set(prev)
      if (next.has(mascota)) {
        next.delete(mascota)
      } else {
        next.add(mascota)
      }
      return next
    })
    setPage(1)
  }

  function limpiarFiltros() {
    setMascotasFiltro(new Set())
    setPage(1)
  }

  const mostrarFiltros = counts.perro > 0 && counts.gato > 0

  return (
    <div className={styles.pageBody}>
      <aside className={styles.sidebar}>
        <CategoryTree
          key={currentSlug}
          categories={treeCategories}
          currentSlug={currentSlug}
          mascotasFiltro={mostrarFiltros ? mascotasFiltro : undefined}
          counts={mostrarFiltros ? counts : undefined}
          onToggleMascota={mostrarFiltros ? toggleMascota : undefined}
          onLimpiar={mostrarFiltros ? limpiarFiltros : undefined}
        />
      </aside>

      <div className={styles.productsArea}>
        <CategoryResults
          products={productosPagina}
          totalFiltered={productosFiltrados.length}
          page={page}
          totalPages={totalPages}
          mascotasFiltro={mascotasFiltro}
          limpiarFiltros={limpiarFiltros}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
