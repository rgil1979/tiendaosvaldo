"use client"

import { useState } from "react"
import Image from "next/image"
import { siteConfig } from "@/config/site.config"
import LegalLayout from "@/components/LegalLayout"
import styles from "../legal.module.css"

// Para activar el formulario: agrega NEXT_PUBLIC_FORMSPREE_ID en tu .env.local
// Obtené tu ID gratis en https://formspree.io
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

export default function ContactoPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!FORMSPREE_ID) {
      setStatus("error")
      return
    }

    setStatus("sending")

    try {
      const form = e.currentTarget
      const data = new FormData(form)
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (res.ok) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

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

          {status === "success" ? (
            <div className={styles.highlight}>
              <p>✅ ¡Mensaje enviado! Te respondemos en 24–48 horas hábiles.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {status === "error" && (
                <div className={styles.highlight} style={{ marginBottom: "20px" }}>
                  <p>
                    {!FORMSPREE_ID
                      ? "⚠️ El formulario aún no está configurado. Escribinos directamente a hola@tiendaosvaldo.com.ar"
                      : "❌ Hubo un error al enviar. Intentá de nuevo o escribinos por email."}
                  </p>
                </div>
              )}
              <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="motivo">Motivo</label>
                <select id="motivo" name="motivo" required>
                  <option value="">Seleccioná un motivo</option>
                  <option>Consulta general</option>
                  <option>Reportar un error en el sitio</option>
                  <option>Producto con precio incorrecto</option>
                  <option>Sugerencia de producto</option>
                  <option>Consulta sobre privacidad</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="mensaje">Mensaje</label>
                <textarea id="mensaje" name="mensaje" placeholder="Contanos en qué podemos ayudarte..." required />
              </div>
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Enviando..." : "Enviar mensaje →"}
              </button>
            </form>
          )}
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
