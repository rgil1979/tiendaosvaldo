// app/privacidad/page.tsx
import { Metadata } from "next"
import Link from "next/link"
import styles from "../legal.module.css"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Tienda Osvaldo.",
}

export default function PrivacidadPage() {
  return (
    <LegalLayout active="privacidad" title="Política de Privacidad">
      <div className={styles.highlight}>
        <p>Tienda Osvaldo es un sitio de recomendaciones. No vendemos productos directamente ni recolectamos datos personales para comercializarlos.</p>
      </div>

      <Section title="1. Información que recolectamos">
        <p>Recolectamos información de uso del sitio de forma anónima a través de:</p>
        <ul>
          <li><strong>Google Analytics 4:</strong> datos de navegación anónimos como páginas visitadas, tiempo en el sitio y ubicación geográfica aproximada.</li>
          <li><strong>Google AdSense:</strong> cookies para mostrar anuncios relevantes según el historial de navegación.</li>
          <li><strong>Formulario de contacto:</strong> nombre y email para responder consultas.</li>
          <li><strong>Newsletter:</strong> email para enviar novedades. Podés darte de baja en cualquier momento.</li>
        </ul>
      </Section>

      <Section title="2. Cookies">
        <p>Este sitio usa cookies propias y de terceros. Podés desactivar las publicitarias desde <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.</p>
      </Section>

      <Section title="3. Servicios de terceros">
        <ul>
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Política de privacidad de Google</a></li>
          <li><a href="https://www.mercadolibre.com.ar/privacidad" target="_blank" rel="noopener">Política de privacidad de Mercado Libre</a></li>
        </ul>
      </Section>

      <Section title="4. Contacto">
        <p>Para ejercer derechos sobre tus datos escribinos a <a href="mailto:hola@tiendaosvaldo.com.ar">hola@tiendaosvaldo.com.ar</a>.</p>
      </Section>
    </LegalLayout>
  )
}

// ─── Componentes compartidos ───────────────────

function LegalLayout({
  children,
  active,
  title,
}: {
  children: React.ReactNode
  active: string
  title: string
}) {
  const tabs = [
    { href: "/privacidad", label: "Privacidad", id: "privacidad" },
    { href: "/terminos",   label: "Términos de uso", id: "terminos" },
    { href: "/afiliados",  label: "Política de afiliados", id: "afiliados" },
    { href: "/contacto",   label: "Contacto", id: "contacto" },
  ]

  return (
    <>
      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div className={styles.eyebrow}>📄 Legal</div>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageMeta}>Última actualización: enero 2025</p>
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
        <div className={styles.updated}>✓ Documento vigente</div>
        {children}
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}
