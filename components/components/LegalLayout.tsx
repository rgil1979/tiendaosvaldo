import Link from "next/link"
import styles from "@/app/legal.module.css"

interface LegalLayoutProps {
  children: React.ReactNode
  active: string
  title: string
  subtitle?: string
  eyebrow?: string
  showUpdated?: boolean
}

const tabs = [
  { href: "/privacidad", label: "Privacidad",            id: "privacidad" },
  { href: "/terminos",   label: "Términos de uso",       id: "terminos" },
  { href: "/afiliados",  label: "Política de afiliados", id: "afiliados" },
  { href: "/contacto",   label: "Contacto",              id: "contacto" },
]

export default function LegalLayout({
  children,
  active,
  title,
  subtitle,
  eyebrow = "📄 Legal",
  showUpdated = true,
}: LegalLayoutProps) {
  return (
    <>
      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div className={styles.eyebrow}>{eyebrow}</div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageMeta}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.legalNav}>
        <div className={styles.legalNavInner}>
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {showUpdated && <div className={styles.updated}>✓ Documento vigente</div>}
        {children}
      </div>
    </>
  )
}
