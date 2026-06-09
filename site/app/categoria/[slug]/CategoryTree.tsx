"use client"
import Link from "next/link"
import styles from "./CategoryTree.module.css"

const CATEGORIAS_CURADAS = [
  { slug: "collares",   name: "Collares y arneses" },
  { slug: "camas",      name: "Camas y cuchas" },
  { slug: "juguetes",   name: "Juguetes" },
  { slug: "accesorios", name: "Accesorios" },
]

interface Props {
  categories: unknown[]
  currentSlug: string
}

export default function CategoryTree({ currentSlug }: Props) {
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
    </div>
  )
}
