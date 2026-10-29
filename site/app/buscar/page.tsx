import { Metadata } from "next"
import Link from "next/link"
import { buscarCurados, curadoATarjeta } from "@/lib/buscar-curados"
import SearchResults from "./SearchResults"
import type { MLProductFull } from "@/lib/mercadolibre"
import styles from "./page.module.css"

interface Props {
  searchParams: Promise<{ q?: string; pagina?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const q  = sp.q?.trim() ?? ""
  return {
    title:       q ? `Buscar: "${q}"` : "Buscar",
    description: q ? `Resultados para "${q}" en Tienda Osvaldo.` : "Buscá productos para mascotas.",
    openGraph:   { title: q ? `Buscar: "${q}" — Tienda Osvaldo` : "Buscar — Tienda Osvaldo" },
    // Sin canónica a propósito: es noindex y mezclar las dos señales confunde a Google (S1-10).
    robots:      { index: false, follow: false },
  }
}

const LIMIT = 16

export default async function SearchPage({ searchParams }: Props) {
  const sp    = await searchParams
  const query = sp.q?.trim() ?? ""
  const page  = Math.max(1, parseInt(sp.pagina ?? "1", 10) || 1)

  // Busca en el catálogo curado, sin la API de ML (S1-12).
  const allProducts: MLProductFull[] = query ? buscarCurados(query).map(curadoATarjeta) : []

  const total      = allProducts.length
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const safePage   = Math.min(page, totalPages)
  const offset     = (safePage - 1) * LIMIT
  const products   = allProducts.slice(offset, offset + LIMIT)

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
                ? <>{total} {total === 1 ? "producto" : "productos"} para <strong>&ldquo;{query}&rdquo;</strong></>
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
            <p className={styles.emptySub}>Buscamos entre los productos seleccionados del sitio. Probá con otra palabra (por ejemplo: pretal, arena o cama) o explorá las categorías.</p>
            <Link href="/categoria/mascotas" className="btn btn-ghost">
              Ver todas las categorías →
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <SearchResults
            products={products}
            page={safePage}
            totalPages={totalPages}
            query={query}
          />
        )}
      </div>
    </div>
  )
}
