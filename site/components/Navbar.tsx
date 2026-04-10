"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { navConfig, siteConfig } from "@/config/site.config"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Logo */}
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

        {/* Nav links */}
        <nav className={styles.nav}>
          {navConfig.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname?.startsWith(item.href) ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={navConfig.cta.href}
            className={`${styles.navLink} ${styles.navPill}`}
          >
            {navConfig.cta.label}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className={styles.menuBtn} aria-label="Menú">
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  )
}
