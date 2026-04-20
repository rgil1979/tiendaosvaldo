import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SLUG_CONFIG } from "@/config/site.config"
import { getProducts, getProducts_batch } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

export const revalidate = 3600

interface Props {
  params:       { slug: string }
  searchParams: { pagina?: string; mascota?: string }
}

export function generateStaticParams() {
  return Object.keys(SLUG_CONFIG).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cfg = SLUG_CONFIG[params.slug]
  if (!cfg) return {}
  return {
    title:       `${cfg.label} — Tienda Osvaldo`,
    description: `${cfg.label} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
  }
}

const LIMIT     = 20
const MAX_TOTAL = 300                          // cap de productos por categoría
const MAX_PAGES = Math.ceil(MAX_TOTAL / LIMIT) // 15 páginas

export default async function CategoryPage({ params, searchParams }: Props) {
  const cfg = SLUG_CONFIG[params.slug]
  if (!cfg) notFound()

  const page   = Math.min(Math.max(1, parseInt(searchParams.pagina ?? "1")), MAX_PAGES)
  const offset = (page - 1) * LIMIT

  const mascotaFilter = searchParams.mascota
  const query = [cfg.query, mascotaFilter].filter(Boolean).join(" ") || undefined

  let products: MLProductFull[] = []
  let total   = 0

  try {
    const result = await getProducts({ domainId: cfg.domainId, query, limit: LIMIT, offset })
    total   = Math.min(result.total, MAX_TOTAL) // capear en 300
    if (result.products.length) {
      products = await getProducts_batch(result.products.map((p) => p.id))
    }
  } catch {
    // Vacío silencioso
  }

  const totalPages = Math.ceil(total / LIMIT) || 1

  const siblings = Object.entries(SLUG_CONFIG).filter(
    ([s]) => s !== params.slug && !["mascotas", "alimentacion"].includes(s)
  )

  function pageHref(p: number) {
    const qs = new URLSearchParams()
    if (p > 1) qs.set("pagina", String(p))
    if (mascotaFilter) qs.set("mascota", mascotaFilter)
    const q = qs.toString()
    return `/categoria/${params.slug}${q ? `?${q}` : ""}`
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/">Inicio</Link>
          <span>›</span>
          <span>{cfg.label}</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.catHeader}>
        <div className={styles.catHeaderInner}>
          <div className={styles.catHeaderLeft}>
            <div className={styles.catIconBig}>{cfg.emoji}</div>
            <div>
              <h1 className={styles.catTitle}>{cfg.label}</h1>
              {total > 0 && (
                <p className={styles.catMeta}>
                  {total.toLocaleString("es-AR")} productos disponibles
                </p>
              )}
            </div>
          </div>
          <div className={styles.subcats}>
            {siblings.slice(0, 6).map(([slug, info]) => (
              <Link key={slug} href={`/categoria/${slug}`} className={styles.subcat}>
                {info.emoji} {info.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className={styles.pageBody}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <form method="GET" className={styles.sidebarForm}>
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>Tipo de mascota</div>
              {[
                { value: "",      label: "Todos" },
                { value: "perro", label: "🐕 Perros" },
                { value: "gato",  label: "🐈 Gatos"  },
              ].map((opt) => (
                <label key={opt.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="mascota"
                    value={opt.value}
                    defaultChecked={(searchParams.mascota ?? "") === opt.value}
                    className={styles.radio}
                  />
                  <span className={styles.filterLabel}>{opt.label}</span>
                </label>
              ))}
            </div>
            <button type="submit" className={`btn btn-fill btn-sm ${styles.applyBtn}`}>
              Aplicar filtros
            </button>
            <Link href={`/categoria/${params.slug}`} className={styles.clearFilters}>
              Limpiar filtros
            </Link>
          </form>
        </aside>

        {/* Productos */}
        <div className={styles.productsArea}>
          <div className={styles.toolbar}>
            <span className={styles.resultsCount}>
              {total > 0 ? `${total.toLocaleString("es-AR")} productos` : cfg.label}
            </span>
            {totalPages > 1 && (
              <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            )}
          </div>

          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span>🐾</span>
              <p>No encontramos productos en este momento.</p>
              <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Páginas">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className={`${styles.pageBtn} ${styles.pageBtnArrow}`}>
                  ← Anterior
                </Link>
              )}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const n = start + i
                if (n > totalPages) return null
                return (
                  <Link
                    key={n}
                    href={pageHref(n)}
                    className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ""}`}
                  >
                    {n}
                  </Link>
                )
              })}
              {page < totalPages && (
                <Link href={pageHref(page + 1)} className={`${styles.pageBtn} ${styles.pageBtnArrow}`}>
                  Siguiente →
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  )
}
