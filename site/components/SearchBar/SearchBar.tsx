import styles from "./SearchBar.module.css"

export default function SearchBar() {
  return (
    <form action="/buscar" method="GET" className={styles.form} role="search">
      <input
        name="q"
        type="search"
        placeholder="Buscar productos..."
        className={styles.input}
        autoComplete="off"
        maxLength={120}
        aria-label="Buscar productos"
      />
      <button type="submit" className={styles.btn} aria-label="Buscar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </form>
  )
}
