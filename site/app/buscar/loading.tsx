import styles from "./loading.module.css"

export default function BuscarLoading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} aria-label="Cargando resultados..." role="status">
        <div className={styles.paw}>🐾</div>
        <p className={styles.text}>Buscando productos...</p>
      </div>
    </div>
  )
}
