// app/privacidad/page.tsx
import { Metadata } from "next"
import LegalLayout from "@/components/LegalLayout"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  )
}
