import { Metadata } from "next"
import Image from "next/image"
import { siteConfig } from "@/config/site.config"
import LegalLayout from "@/components/LegalLayout"
import ContactForm from "./ContactForm"
import styles from "../legal.module.css"

export const metadata: Metadata = {
  title:       "Contacto — Tienda Osvaldo",
  description: "¿Tenés una pregunta o sugerencia? Escribinos. Respondemos en 24 a 48 horas hábiles.",
}

export default function ContactoPage() {
  return (
    <LegalLayout
      active="contacto"
      title="Hablemos"
      subtitle="¿Tenés una pregunta o sugerencia? Escribinos."
      eyebrow="✉️ Contacto"
      showUpdated={false}
    >
      <div className={styles.contactLayout}>

        {/* Formulario */}
        <div>
          <h2 className={styles.formTitle}>Envianos un mensaje</h2>
          <ContactForm />
        </div>

        {/* Sidebar */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>✉️</div>
            <h3>Email directo</h3>
            <p><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📸</div>
            <h3>Instagram</h3>
            <p>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener">
                {siteConfig.social.instagramHandle}
              </a>
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>⏱️</div>
            <h3>Tiempo de respuesta</h3>
            <p>Respondemos en 24 a 48 horas hábiles.</p>
          </div>
          <div className={styles.osvaldoNote}>
            <div className={styles.osvaldoNoteHeader}>
              <div className={styles.osvaldoNoteAvatar}>
                <Image src={siteConfig.logo} alt="Osvaldo" fill style={{ objectFit: "cover" }} />
              </div>
              <span className={styles.noteName}>Osvaldo dice:</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 500, lineHeight: 1.6 }}>
              Si tenés una sugerencia de producto, me encanta recibirla. Yo la evalúo personalmente con mi hocico.
            </p>
          </div>
          <div className={styles.noteMsgNoML}>
            <h4>Para qué NO somos el contacto correcto</h4>
            <ul>
              <li>Problemas con una compra en ML</li>
              <li>Seguimiento de envíos</li>
              <li>Devoluciones o garantías</li>
              <li>Contactar a un vendedor</li>
            </ul>
            <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px", fontWeight: 500 }}>
              Para esto usá el{" "}
              <a href="https://www.mercadolibre.com.ar/ayuda" style={{ color: "var(--orange)", fontWeight: 600 }} target="_blank" rel="noopener">
                soporte de Mercado Libre →
              </a>
            </p>
          </div>
        </div>
      </div>
    </LegalLayout>
  )
}
