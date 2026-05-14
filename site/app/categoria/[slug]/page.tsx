import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SLUG_CONFIG } from "@/config/site.config"
import { getProductsFiltered, getProducts_batch, getHighlights, getItemsByCategory } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import { getAllCategoriesForTree, getCategoryBySlug } from "@/lib/categories"
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

const LIMIT     = 16
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
        const [hlProducts, supplementResult] = await Promise.all([
          getHighlights(cfg.hlCategoryId!, LIMIT),
          getProductsFiltered({
            query:     cfg.query,
            domainIds: cfg.domainId ? [cfg.domainId] : undefined,
            limit:     50,
            offset:    0,
          }),
        ])
        total = Math.min(supplementResult.total, MAX_TOTAL)
        if (hlProducts.length >= LIMIT) {
          products = hlProducts
        } else {
          const hlIds = new Set(hlProducts.map(p => p.id))
          const supplementIds = supplementResult.products
            .map(p => p.id)
            .filter(id => !hlIds.has(id))
            .slice(0, LIMIT - hlProducts.length)
          const extra = supplementIds.length
            ? await getProducts_batch(supplementIds, false)
            : []
          products = [...hlProducts, ...extra].slice(0, LIMIT)
        }
      } else {
        const result = await getProductsFiltered({
          query:     cfg.query,
          domainIds: cfg.domainId ? [cfg.domainId] : undefined,
          mascota:   mascotaFilter ?? null,
          limit:     50,
          offset,
        })
        total   = Math.min(result.total, MAX_TOTAL)
        if (result.products.length) {
          const all = await getProducts_batch(result.products.map(p => p.id), false)
          products = all.slice(0, LIMIT)
        }
      }
    } else if (dbCat) {
      // Subcategoría de DB: búsqueda de items por categoría ML
      console.log("[PAGE] dbCat branch — mlId:", dbCat.mlId, "slug:", dbCat.slug)
      const result = await getItemsByCategory(dbCat.mlId, LIMIT, offset)
      console.log("[PAGE] getItemsByCategory result — products:", result.products.length, "total:", result.total)
      products = result.products
      total    = Math.min(result.total, MAX_TOTAL)
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
