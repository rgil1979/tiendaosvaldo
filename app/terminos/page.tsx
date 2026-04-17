// ─── app/terminos/page.tsx ───────────────────────────────────────────────────

import { Metadata } from "next"
import LegalLayout from "@/components/LegalLayout"
import styles from "../legal.module.css"

export const metadata: Metadata = {
  title: "Términos de Uso",
  description: "Términos de uso de Tienda Osvaldo.",
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}

export default function TerminosPage() {
  return (
    <LegalLayout active="terminos" title="Términos de Uso">
      <div className={styles.highlight}>
        <p>Al usar Tienda Osvaldo aceptás estos términos. Las compras se realizan exclusivamente en Mercado Libre y aplican sus propios términos y condiciones.</p>
      </div>

      <Section title="1. Sobre el sitio">
        <p>Tienda Osvaldo es un sitio de recomendaciones de productos para mascotas que funciona como afiliado del Programa de Afiliados y Creadores de Mercado Libre.</p>
        <p>No somos una tienda online. No vendemos productos directamente, no manejamos stock, no procesamos pagos ni gestionamos envíos.</p>
      </Section>

      <Section title="2. Precios y disponibilidad">
        <p>Los precios se obtienen en tiempo real desde la API de Mercado Libre y pueden variar. El precio final es el que figura en ML al momento de la compra.</p>
      </Section>

      <Section title="3. Responsabilidad sobre las compras">
        <ul>
          <li>La relación contractual de la compra es entre el comprador y el vendedor en Mercado Libre</li>
          <li>Las garantías, devoluciones y reclamos se gestionan según las políticas de Mercado Libre</li>
          <li>Tienda Osvaldo no es responsable por la calidad, autenticidad o entrega de los productos</li>
        </ul>
      </Section>

      <Section title="4. Propiedad intelectual">
        <p>El contenido editorial de Tienda Osvaldo — textos, diseño, artículos del blog — es propiedad de Tienda Osvaldo. Las imágenes de productos pertenecen a sus vendedores en ML.</p>
      </Section>

      <Section title="5. Ley aplicable">
        <p>Estos términos se rigen por las leyes de la República Argentina. Jurisdicción: Ciudad Autónoma de Buenos Aires.</p>
      </Section>

      <Section title="6. Contacto">
        <p>Escribinos a <a href="mailto:hola@tiendaosvaldo.com.ar">hola@tiendaosvaldo.com.ar</a>.</p>
      </Section>
    </LegalLayout>
  )
}
