import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SLUG_CONFIG } from "@/config/site.config"
import { getProductsFiltered } from "@/lib/mercadolibre"
import { getAllCategoriesForTree, getCategoryBySlug } from "@/lib/categories"
import CategoryResults from "./CategoryResults"
import CategoryTree from "./CategoryTree"
import styles from "./page.module.css"

export const revalidate = 3600

interface Props {
  params:       Promise<{ slug: string }>
  searchParams: Promise<{ pagina?: string; mascota?: string }>
}

export function generateStaticParams() {
  return Object.keys(SLUG_CONFIG).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cfg = SLUG_CONFIG[slug]
  if (cfg) {
    return {
      title:       `${cfg.label} — Tienda Osvaldo`,
      description: `${cfg.label} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
      robots:      { index: true, follow: true },
    }
  }
  const dbCat = await getCategoryBySlug(slug)
  if (!dbCat) return { robots: { index: false, follow: false } }
  return {
    title:       `${dbCat.name} — Tienda Osvaldo`,
    description: `${dbCat.name} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
    robots:      { index: true, follow: true },
  }
}

const LIMIT      = 16
const MAX_TOTAL  = 300
const MAX_PAGES  = Math.ceil(MAX_TOTAL / LIMIT)

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const qp = await searchParams
  const cfg = SLUG_CONFIG[slug]

  const [treeCategories, dbCat] = await Promise.all([
    getAllCategoriesForTree(),
    getCategoryBySlug(slug),
  ])

  if (!cfg && !dbCat) notFound()

  const mascotaFilter = qp?.mascota ?? ""
  const page = Math.min(Math.max(1, parseInt(qp.pagina ?? "1", 10)), MAX_PAGES)
  const offset = (page - 1) * LIMIT

  const { products, total } = await getProductsFiltered({
    domainIds: cfg ? [cfg.domainId] : undefined,
    query:     cfg ? cfg.query : dbCat?.name,
    mascota:   mascotaFilter as "perro" | "gato" | "ambas" | null,
    limit:     LIMIT,
    offset,
  })

  const totalPages = Math.ceil(total / LIMIT) || 1
  const label = cfg?.label ?? dbCat?.name ?? ""
  const emoji = cfg?.emoji ?? "🐾"

  const siblings = Object.entries(SLUG_CONFIG).filter(
    ([s]) => s !== slug && !["mascotas", "alimentacion"].includes(s)
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
          <CategoryTree
            key={slug}
            categories={treeCategories}
            currentSlug={slug}
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
              slug={slug}
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