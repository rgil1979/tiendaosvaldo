"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { navConfig, siteConfig } from "@/config/site.config"
import styles from "./Navbar.module.css"

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <div className={styles.logoMark}>
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={64}
              height={64}
              className={styles.logoImg}
            />
          </div>
          <span className={styles.logoName}>
            Tienda <em>Osvaldo</em>
          </span>
        </Link>

        {/* Nav links — desktop siempre visible, mobile condicional */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
          {navConfig.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`${styles.navLink} ${
                pathname?.startsWith(item.href) ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={navConfig.cta.href}
            onClick={closeMenu}
            className={`${styles.navLink} ${styles.navGhost} ${
              pathname === navConfig.cta.href ? styles.active : ""
            }`}
          >
            {navConfig.cta.label}
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ""}`}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  )
}
