import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { searchProducts, getCategory } from "@/lib/mercadolibre"
import { mlConfig } from "@/config/site.config"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

// Mapa de slugs a IDs de ML
const categoryMap: Record<string, { id: string; label: string; emoji: string; desc: string }> = {
  mascotas:    { id: mlConfig.categories.mascotas,    label: "Mascotas",    emoji: "🐾", desc: "Todo para tus peludos" },
  perros:      { id: mlConfig.categories.perros,      label: "Perros",      emoji: "🐕", desc: "Accesorios, alimentos y más para tu perro" },
  gatos:       { id: mlConfig.categories.gatos,       label: "Gatos",       emoji: "🐈", desc: "Todo lo que tu gato necesita" },
  accesorios:  { id: mlConfig.categories.accesorios,  label: "Accesorios",  emoji: "🦮", desc: "Collares, correas, ropa y más" },
  alimentacion:{ id: mlConfig.categories.alimentacion,label: "Alimentación",emoji: "🍖", desc: "Alimentos y snacks para mascotas" },
  juguetes:    { id: mlConfig.categories.juguetes,    label: "Juguetes",    emoji: "🧸", desc: "Juguetes y entretenimiento" },
}

interface Props {
  params: { slug: string }
  searchParams: { orden?: string; pagina?: string; precioMin?: string; precioMax?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categoryMap[params.slug]
  if (!cat) return {}
  return {
    title: cat.label,
    description: cat.desc,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const cat = categoryMap[params.slug]
  if (!cat) notFound()

  const page = parseInt(searchParams.pagina || "1")
  const limit = mlConfig.search.defaultLimit
  const offset = (page - 1) * limit
  const sort = searchParams.orden || mlConfig.search.defaultSort
  const priceMin = searchParams.precioMin ? parseInt(searchParams.precioMin) : undefined
  const priceMax = searchParams.precioMax ? parseInt(searchParams.precioMax) : undefined

  let result: import("@/lib/mercadolibre").MLSearchResult | null = null
  try {
    result = await searchProducts({
      categoryId: cat.id,
      limit,
      offset,
      sort,
      priceMin,
      priceMax,
    })
  } catch (e) {
    console.error("Error fetching category:", e)
  }

  const products = result?.results || []
  const total = result?.paging.total || 0
  const totalPages = Math.ceil(total / limit)

  const sortOptions = [
    { value: "relevance",              label: "Más relevantes" },
    { value: "price_asc",              label: "Menor precio" },
    { value: "price_desc",             label: "Mayor precio" },
    { value: "reviews_rating_average", label: "Mejor calificados" },
  ]

  const subcats = Object.entries(categoryMap).filter(([slug]) =>
    slug !== "mascotas" && slug !== params.slug
  )

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href="/">Inicio</Link>
          <span>›</span>
          <span>{cat.label}</span>
        </div>
      </div>

      {/* Header de categoría */}
      <div className={styles.catHeader}>
        <div className={styles.catHeaderInner}>
          <div className={styles.catHeaderLeft}>
            <div className={styles.catIconBig}>{cat.emoji}</div>
            <div>
              <h1 className={styles.catTitle}>{cat.label}</h1>
              <div className={styles.catMeta}>
                <span>{total.toLocaleString("es-AR")}+ productos</span>
                <div className={styles.catDot} />
                <span>⭐ Solo rep. verde en ML</span>
                <div className={styles.catDot} />
                <span>Actualizado ahora</span>
              </div>
            </div>
          </div>

          {/* Subcategorías */}
          <div className={styles.subcats}>
            <Link href="/categoria/mascotas" className={styles.subcat}>
              Todos
            </Link>
            {subcats.map(([slug, info]) => (
              <Link
                key={slug}
                href={`/categoria/${slug}`}
                className={`${styles.subcat} ${slug === params.slug ? styles.subcatActive : ""}`}
              >
                {info.emoji} {info.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.pageBody}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <form method="GET" className={styles.sidebarForm}>

            {/* Precio */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>Precio</div>
              <div className={styles.priceRange}>
                <input
                  name="precioMin"
                  type="number"
                  placeholder="Mín"
                  defaultValue={searchParams.precioMin}
                  className={styles.priceInput}
                />
                <span className={styles.priceSep}>—</span>
                <input
                  name="precioMax"
                  type="number"
                  placeholder="Máx"
                  defaultValue={searchParams.precioMax}
                  className={styles.priceInput}
                />
              </div>
              <button type="submit" className={`btn btn-fill btn-sm ${styles.applyBtn}`}>
                Aplicar
              </button>
            </div>

            {/* Condición */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>Condición</div>
              {[
                { value: "new",  label: "Nuevo" },
                { value: "used", label: "Usado" },
              ].map((opt) => (
                <label key={opt.value} className={styles.filterOption}>
                  <input type="radio" name="condicion" value={opt.value} className={styles.radio} />
                  <span className={styles.filterLabel}>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Orden */}
            <div className={styles.sidebarSection}>
              <div className={styles.sidebarTitle}>Ordenar por</div>
              {sortOptions.map((opt) => (
                <label key={opt.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="orden"
                    value={opt.value}
                    defaultChecked={sort === opt.value}
                    className={styles.radio}
                  />
                  <span className={styles.filterLabel}>{opt.label}</span>
                </label>
              ))}
            </div>

          </form>
        </aside>

        {/* Productos */}
        <div className={styles.productsArea}>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <span className={styles.resultsCount}>
              {total.toLocaleString("es-AR")} productos
            </span>
            <div className={styles.toolbarRight}>
              <select name="orden" className={styles.sortSelect}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} selected={sort === opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={i === 0 ? "Top ventas" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>No encontramos productos. Probá con otros filtros.</p>
              <Link href={`/categoria/${params.slug}`} className="btn btn-ghost">
                Limpiar filtros
              </Link>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {page > 1 && (
                <Link
                  href={`/categoria/${params.slug}?pagina=${page - 1}&orden=${sort}`}
                  className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
                >
                  ← Anterior
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/categoria/${params.slug}?pagina=${p}&orden=${sort}`}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/categoria/${params.slug}?pagina=${page + 1}&orden=${sort}`}
                  className={`${styles.pageBtn} ${styles.pageBtnArrow}`}
                >
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
