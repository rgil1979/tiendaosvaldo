import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SLUG_CONFIG } from "@/config/site.config"
import { getProductosByCategoria, productosCurados } from "@/data/productos-curados"
import { getAllCategoriesForTree, getCategoryBySlug } from "@/lib/categories"
import CategoryResults from "./CategoryResults"
import CategoryTree from "./CategoryTree"
import styles from "./page.module.css"

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(SLUG_CONFIG).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cfg = SLUG_CONFIG[slug]
  if (cfg) {
    return {
      title:       cfg.label,
      description: `${cfg.label} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
      openGraph:   { title: `${cfg.label} — Tienda Osvaldo` },
      robots:      { index: true, follow: true },
    }
  }
  const dbCat = await getCategoryBySlug(slug)
  if (!dbCat) return { robots: { index: false, follow: false } }
  return {
    title:       dbCat.name,
    description: `${dbCat.name} para mascotas. Los mejores productos disponibles en Mercado Libre.`,
    openGraph:   { title: `${dbCat.name} — Tienda Osvaldo` },
    robots:      { index: true, follow: true },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cfg = SLUG_CONFIG[slug]

  const [treeCategories, dbCat] = await Promise.all([
    getAllCategoriesForTree(),
    getCategoryBySlug(slug),
  ])

  let products = getProductosByCategoria(slug)

  if (slug === "perros") {
    products = productosCurados.filter(p => p.mascota === "perro")
  } else if (slug === "gatos") {
    products = productosCurados.filter(p => p.mascota === "gato")
  } else if (slug === "mascotas" || slug === "accesorios" || slug === "juguetes") {
    if (products.length === 0) {
      products = productosCurados
    }
  }

  const total = products.length
  const totalPages = 1
  const page = 1

  if (!cfg && !dbCat && products.length === 0) notFound()

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
          </div>

          {products.length > 0 ? (
            <CategoryResults
              products={products}
              page={page}
              totalPages={totalPages}
              slug={slug}
              mascotaFilter=""
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
