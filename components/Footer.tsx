import Link from "next/link"
import Image from "next/image"
import { navConfig, siteConfig } from "@/config/site.config"
import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={36}
                height={36}
                className={styles.logoImg}
              />
            </div>
            <span className={styles.logoName}>
              Tienda <em>Osvaldo</em>
            </span>
          </Link>
          <p className={styles.desc}>
            El pet shop aprobado por Osvaldo, un perro mestizo adoptado con muy buen gusto. Todos los productos se compran directamente en Mercado Libre.
          </p>
        </div>

        {/* Categorías */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>CATEGORÍAS</h4>
          <ul className={styles.colLinks}>
            {navConfig.footer.categorias.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tienda */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>TIENDA</h4>
          <ul className={styles.colLinks}>
            {navConfig.footer.tienda.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>LEGAL</h4>
          <ul className={styles.colLinks}>
            {navConfig.footer.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Tienda Osvaldo — Hecho con 🧡 en Argentina</p>
        <div className={styles.badge}>
          🛍 Afiliados oficiales de Mercado Libre
        </div>
      </div>
    </footer>
  )
}
