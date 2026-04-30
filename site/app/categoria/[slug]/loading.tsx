import styles from "@/app/buscar/loading.module.css"

export default function CategoryLoading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner}>
        <div className={styles.paw}>🐾</div>
        <p className={styles.text}>Cargando productos...</p>
      </div>
    </div>
  )
}
