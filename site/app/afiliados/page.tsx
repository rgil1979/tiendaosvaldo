import { Metadata } from "next"
import Link from "next/link"
import styles from "../legal.module.css"

export const metadata: Metadata = {
  title: "Política de Afiliados",
  description: "Política de afiliados de Tienda Osvaldo.",
}

function LegalLayout({ children, active, title }: { children: React.ReactNode; active: string; title: string }) {
  const tabs = [
    { href: "/privacidad", label: "Privacidad",           id: "privacidad" },
    { href: "/terminos",   label: "Términos de uso",      id: "terminos" },
    { href: "/afiliados",  label: "Política de afiliados",id: "afiliados" },
    { href: "/contacto",   label: "Contacto",             id: "contacto" },
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
            <Link key={tab.id} href={tab.href} className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}>
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

export default function AfiliadosPage() {
  return (
    <LegalLayout active="afiliados" title="Política de Afiliados">
      <div className={styles.disclosureBox}>
        <h3>🐾 Aviso de transparencia</h3>
        <p>Tienda Osvaldo participa del <span>Programa de Afiliados y Creadores de Mercado Libre</span>. Cuando hacés clic en un enlace y comprás, recibimos una pequeña comisión. Esto no tiene ningún costo adicional para vos — el precio es exactamente el mismo.</p>
      </div>

      <Section title="1. Qué es el marketing de afiliados">
        <p>El marketing de afiliados es un modelo en el que un sitio web recibe una comisión por recomendar productos de terceros. No implica ningún costo adicional para el comprador.</p>
      </Section>

      <Section title="2. Nuestra relación con Mercado Libre">
        <ul>
          <li>Generamos enlaces de afiliado con nuestro ID de afiliado</li>
          <li>Las comisiones varían según la categoría del producto</li>
          <li>Somos afiliados independientes, sin relación laboral con Mercado Libre</li>
        </ul>
      </Section>

      <Section title="3. Independencia editorial">
        <p>Las comisiones no influyen en qué productos recomendamos. Solo publicamos productos de vendedores con reputación verde y 4+ estrellas. No aceptamos pagos de vendedores para destacar sus productos.</p>
      </Section>

      <Section title="4. Transparencia de precios">
        <p>El precio que pagás es exactamente el mismo que pagarías accediendo directamente a Mercado Libre. Las comisiones las paga ML con cargo a su propio margen.</p>
      </Section>

      <Section title="5. Contacto">
        <p>Para consultas sobre afiliados escribinos a <a href="mailto:hola@tiendaosvaldo.com.ar">hola@tiendaosvaldo.com.ar</a>.</p>
      </Section>
    </LegalLayout>
  )
}
