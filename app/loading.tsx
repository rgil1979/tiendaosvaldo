import styles from "./loading.module.css"

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.card}>
            <div className={`${styles.skeleton} ${styles.img}`} />
            <div className={styles.body}>
              <div className={`${styles.skeleton} ${styles.line} ${styles.lineShort}`} />
              <div className={`${styles.skeleton} ${styles.line}`} />
              <div className={`${styles.skeleton} ${styles.line} ${styles.lineMid}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
