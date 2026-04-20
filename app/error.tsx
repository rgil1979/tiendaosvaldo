"use client"

import { useEffect } from "react"
import Link from "next/link"
import styles from "./error.module.css"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>🐾</div>
      <h1 className={styles.title}>Osvaldo encontró un problema</h1>
      <p className={styles.desc}>
        Algo salió mal cargando esta página. Puede ser un problema temporal con los productos de Mercado Libre.
      </p>
      <div className={styles.actions}>
        <button onClick={reset} className="btn btn-fill">
          Intentar de nuevo
        </button>
        <Link href="/" className="btn btn-ghost">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
