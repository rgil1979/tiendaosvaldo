import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SLUG_CONFIG } from "@/config/site.config"
import { getProductsFiltered, getProducts_batch, getHighlights } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import { getAllCategoriesForTree, getCategoryBySlug } from "@/lib/categories"
import type { CategoryNode } from "@/lib/categories"
import CategoryResults from "./CategoryResults"
import CategoryTree from "./CategoryTree"
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
  if (cfg) {
    return {
      title:       `${cfg.label} — Tienda Osvaldo`,
      description: `${cfg.label} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
    }
  }
  const dbCat = await getCategoryBySlug(params.slug)
  if (!dbCat) return {}
  return {
    title:       `${dbCat.name} — Tienda Osvaldo`,
    description: `${dbCat.name} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
  }
}

const LIMIT     = 12
const MAX_TOTAL = 300
const MAX_PAGES = Math.ceil(MAX_TOTAL / LIMIT)

export default async function CategoryPage({ params, searchParams }: Props) {
  const cfg = SLUG_CONFIG[params.slug]

  // Fetch en paralelo: árbol de categorías + categoría actual en DB
  const [treeCategories, dbCat] = await Promise.all([
    getAllCategoriesForTree(),
    getCategoryBySlug(params.slug),
  ])

  if (!cfg && !dbCat) notFound()

  const page   = Math.min(Math.max(1, parseInt(searchParams.pagina ?? "1", 10)), MAX_PAGES)
  const offset = (page - 1) * LIMIT

  const mascotaFilter = searchParams.mascota as "perro" | "gato" | undefined

  let products: MLProductFull[] = []
  let total   = 0

  try {
    if (cfg) {
      // Lógica existente con SLUG_CONFIG
      const useHighlights = cfg.hlCategoryId && page === 1 && !mascotaFilter

      if (useHighlights) {
        const [hlProducts, searchResult] = await Promise.all([
          getHighlights(cfg.hlCategoryId!, LIMIT),
          getProductsFiltered({
            query:     cfg.query,
            domainIds: cfg.domainId ? [cfg.domainId] : undefined,
            limit:     1,
            offset:    0,
          }),
        ])
        products = hlProducts
        total    = Math.min(searchResult.total, MAX_TOTAL)
      } else {
        const fetchLimit = 50
        const result = await getProductsFiltered({
          query:     cfg.query,
          domainIds: cfg.domainId ? [cfg.domainId] : undefined,
          mascota:   mascotaFilter ?? null,
          limit:     fetchLimit,
          offset,
        })
        total   = Math.min(result.total, MAX_TOTAL)
        if (result.products.length) {
          const all = await getProducts_batch(result.products.map(p => p.id), true)
          products = all.slice(0, LIMIT)
        }
      }
    } else if (dbCat) {
      // Categoría de DB sin SLUG_CONFIG: buscar por nombre de categoría
      const result = await getProductsFiltered({
        query: dbCat.name,
        limit: 50,
        offset,
      })
      total = Math.min(result.total, MAX_TOTAL)
      if (result.products.length) {
        const all = await getProducts_batch(result.products.map(p => p.id), true)
        products = all.slice(0, LIMIT)
      }
    }
  } catch {
    // Vacío silencioso
  }

  const totalPages = Math.ceil(total / LIMIT) || 1

  // Datos de presentación: label y emoji según fuente
  const label = cfg?.label ?? dbCat?.name ?? ""
  const emoji = cfg?.emoji ?? "🐾"

  const siblings = Object.entries(SLUG_CONFIG).filter(
    ([s]) => s !== params.slug && !["mascotas", "alimentacion"].includes(s)
  )

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/">Inicio</Link>
          <span>›</span>
          <span>{label}</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.catHeader}>
        <div className={styles.catHeaderInner}>
          <div className={styles.catHeaderLeft}>
            <div className={styles.catIconBig}>{emoji}</div>
            <div>
              <h1 className={styles.catTitle}>{label}</h1>
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
          {/* Árbol jerárquico de categorías */}
          <CategoryTree
            key={params.slug}
            categories={treeCategories}
            currentSlug={params.slug}
          />

        </aside>

        {/* Productos */}
        <div className={styles.productsArea}>
          <div className={styles.toolbar}>
            <span className={styles.resultsCount}>
              {total > 0 ? `${total.toLocaleString("es-AR")} productos` : label}
            </span>
            {totalPages > 1 && (
              <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            )}
          </div>

          {products.length > 0 ? (
            <CategoryResults
              products={products}
              page={page}
              totalPages={totalPages}
              slug={params.slug}
              mascotaFilter={mascotaFilter ?? ""}
            />
          ) : (
            <div className={styles.empty}>
              <span>🐾</span>
              <p>No encontramos productos en este momento.</p>
              <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
