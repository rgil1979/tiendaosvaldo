"use client"

import { useState } from "react"
import Link from "next/link"
import type { CategoryNode } from "@/lib/categories"
import styles from "./CategoryTree.module.css"

interface Props {
  categories: CategoryNode[]
  currentSlug: string
}

export default function CategoryTree({ categories, currentSlug }: Props) {
  const level1 = categories.filter((c) => c.level === 1)

  const currentCat = categories.find((c) => c.slug === currentSlug)
  const initialExpanded = currentCat
    ? currentCat.level === 1
      ? currentCat.mlId
      : (currentCat.parentMlId ?? null)
    : null

  const [expandedId, setExpandedId] = useState<string | null>(initialExpanded)

  function toggle(mlId: string) {
    setExpandedId((prev) => (prev === mlId ? null : mlId))
  }

  if (level1.length === 0) return null

  return (
    <div className={styles.tree}>
      <div className={styles.treeHeader}>Categorías</div>
      {level1.map((cat) => {
        const children = categories
          .filter((c) => c.parentMlId === cat.mlId)
        const isExpanded = expandedId === cat.mlId
        const isCurrent = cat.slug === currentSlug
        const hasChildren = children.length > 0

        return (
          <div key={cat.mlId} className={styles.treeGroup}>
            <div className={`${styles.treeRow} ${isCurrent ? styles.treeRowActive : ""}`}>
              <Link
                href={`/categoria/${cat.slug}`}
                className={`${styles.treeLink} ${isCurrent ? styles.treeLinkActive : ""}`}
                onClick={() => hasChildren && setExpandedId(cat.mlId)}
              >
                {cat.name}
              </Link>
              {hasChildren && (
                <button
                  type="button"
                  className={styles.treeToggle}
                  onClick={() => toggle(cat.mlId)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Colapsar categoría" : "Expandir categoría"}
                >
                  <span className={`${styles.treeArrow} ${isExpanded ? styles.treeArrowOpen : ""}`}>
                    ›
                  </span>
                </button>
              )}
            </div>

            {isExpanded && children.length > 0 && (
              <div className={styles.treeChildren}>
                {children.map((child) => {
                  const isChildCurrent = child.slug === currentSlug
                  return (
                    <Link
                      key={child.mlId}
                      href={`/categoria/${child.slug}`}
                      className={`${styles.treeChildLink} ${isChildCurrent ? styles.treeLinkActive : ""}`}
                    >
                      <span className={styles.treeChildName}>{child.name}</span>
                      {child.totalItems > 0 && (
                        <span className={styles.treeCount}>
                          {child.totalItems > 9999
                            ? `${Math.floor(child.totalItems / 1000)}k`
                            : child.totalItems.toLocaleString("es-AR")}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
