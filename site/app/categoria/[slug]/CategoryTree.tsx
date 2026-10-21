"use client"
import Link from "next/link"
import styles from "./CategoryTree.module.css"

const CATEGORIAS_CURADAS = [
  { slug: "collares",   name: "Collares y arneses" },
  { slug: "camas",      name: "Camas y cuchas" },
  { slug: "juguetes",   name: "Juguetes" },
  { slug: "accesorios", name: "Accesorios" },
]

type MascotaFilter = "perro" | "gato"

interface Props {
  categories:      unknown[]
  currentSlug:     string
  mascotasFiltro?: Set<MascotaFilter>
  counts?:         { perro: number; gato: number }
  onToggleMascota?:(mascota: MascotaFilter) => void
  onLimpiar?:      () => void
}

export default function CategoryTree({
  currentSlug,
  mascotasFiltro,
  counts,
  onToggleMascota,
  onLimpiar,
}: Props) {
  const hayFiltros = mascotasFiltro && mascotasFiltro.size > 0
  const mostrarSeccionFiltros = !!counts && !!onToggleMascota

  return (
    <div className={styles.tree}>
      <div className={styles.treeHeader}>Categorías</div>
      {CATEGORIAS_CURADAS.map((cat) => {
        const isCurrent = cat.slug === currentSlug
        return (
          <div key={cat.slug} className={styles.treeGroup}>
            <div className={`${styles.treeRow} ${isCurrent ? styles.treeRowActive : ""}`}>
              <Link
                href={`/categoria/${cat.slug}`}
                className={`${styles.treeLink} ${isCurrent ? styles.treeLinkActive : ""}`}
              >
                {cat.name}
              </Link>
            </div>
          </div>
        )
      })}

      {mostrarSeccionFiltros && (
        <>
          <div className={styles.filterHeader}>
            <span>Mascota</span>
            {hayFiltros && (
              <button className={styles.filterClear} onClick={onLimpiar}>
                Limpiar
              </button>
            )}
          </div>
          {(["perro", "gato"] as MascotaFilter[]).map(mascota => {
            const activo = mascotasFiltro!.has(mascota)
            return (
              <div key={mascota} className={styles.treeGroup}>
                <button
                  type="button"
                  className={`${styles.treeRow} ${styles.filterRow} ${activo ? styles.treeRowActive : ""}`}
                  onClick={() => onToggleMascota!(mascota)}
                  aria-pressed={activo}
                >
                  <span className={`${styles.treeLink} ${activo ? styles.treeLinkActive : ""}`}>
                    {mascota === "perro" ? "🐕 Perro" : "🐈 Gato"}
                  </span>
                  <span className={`${styles.treeCount} ${activo ? styles.treeCountActive : ""}`}>
                    {counts![mascota]}
                  </span>
                </button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
