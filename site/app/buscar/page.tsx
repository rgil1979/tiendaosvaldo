import { Metadata } from "next"
import Link from "next/link"
import { getProducts, getProductsFiltered, getProducts_batch } from "@/lib/mercadolibre"
import SearchResults from "./SearchResults"
import type { MLProductFull } from "@/lib/mercadolibre"
import styles from "./page.module.css"

interface Props {
  searchParams: { q?: string; pagina?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q?.trim() ?? ""
  return {
    title:       q ? `"${q}" — Resultados — Tienda Osvaldo` : "Buscar — Tienda Osvaldo",
    description: q ? `Resultados de búsqueda para "${q}" en Tienda Osvaldo.` : "Buscá productos para mascotas.",
  }
}

const LIMIT     = 16
const MAX_TOTAL = 300
const MAX_PAGES = Math.ceil(MAX_TOTAL / LIMIT) // ~19

export default async function SearchPage({ searchParams }: Props) {
  const query  = searchParams.q?.trim() ?? ""
  const page   = Math.min(Math.max(1, parseInt(searchParams.pagina ?? "1", 10)), MAX_PAGES)
  const offset = (page - 1) * LIMIT

  let products: MLProductFull[] = []
  let total = 0

  if (query) {
    try {
      const result = await getProducts({ query, limit: 50, offset })
      total   = Math.min(result.total, MAX_TOTAL)
      if (result.products.length) {
        const all = await getProducts_batch(result.products.map((p) => p.id), false)
        products = all.slice(0, LIMIT)
      }
    } catch (e) {
      console.error("[buscar] Error al buscar productos:", (e as Error).message)
    }
  }

  const totalPages = Math.ceil(total / LIMIT) || 1

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <form action="/buscar" method="GET" className={styles.searchForm} role="search">
            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Buscar productos..."
              className={styles.searchInput}
              autoFocus
              maxLength={120}
              aria-label="Buscar productos"
            />
            <button type="submit" className={styles.searchBtn}>Buscar</button>
          </form>

          {query && (
            <p className={styles.searchMeta}>
              {total > 0
                ? <>{total.toLocaleString("es-AR")} resultados para <strong>&ldquo;{query}&rdquo;</strong></>
                : <>Sin resultados para <strong>&ldquo;{query}&rdquo;</strong></>}
            </p>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className={styles.body}>
        {!query && (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>Ingresá un término de búsqueda para encontrar productos.</p>
            <Link href="/categoria/mascotas" className="btn btn-ghost">
              Explorar categorías →
            </Link>
          </div>
        )}

        {query && products.length === 0 && (
          <div className={styles.empty}>
            <span>🐾</span>
            <p>Osvaldo buscó pero no encontró nada para <strong>&ldquo;{query}&rdquo;</strong>.</p>
            <p className={styles.emptySub}>Probá con otro término o explorá las categorías.</p>
            <Link href="/categoria/mascotas" className="btn btn-ghost">
              Ver todas las categorías →
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <SearchResults
            products={products}
            page={page}
            totalPages={totalPages}
            query={query}
          />
        )}
      </div>
    </div>
  )
}
