"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site.config"
import styles from "../legal.module.css"

function LegalLayout({ children, active, title, subtitle }: { children: React.ReactNode; active: string; title: string; subtitle?: string }) {
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
          <div className={styles.eyebrow}>✉️ Contacto</div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageMeta}>{subtitle}</p>}
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
      <div className={styles.content}>{children}</div>
    </>
  )
}

export default function ContactoPage() {
  const [status, setStatus] = useState<"idle" | "success">("idle")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Conectar con Formspree o similar cuando esté listo
    setStatus("success")
  }

  return (
    <LegalLayout
      active="contacto"
      title="Hablemos"
      subtitle="¿Tenés una pregunta o sugerencia? Escribinos."
    >
      <div className={styles.contactLayout}>

        {/* Formulario */}
        <div>
          <h2 className={styles.formTitle}>Envianos un mensaje</h2>

          {status === "success" ? (
            <div className={styles.highlight}>
              <p>✅ ¡Mensaje enviado! Te respondemos en 24-48 horas hábiles.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" placeholder="Tu nombre" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="tu@email.com" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="motivo">Motivo</label>
                <select id="motivo" required>
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
                <textarea id="mensaje" placeholder="Contanos en qué podemos ayudarte..." required />
              </div>
              <button type="submit" className={styles.btnSubmit}>
                Enviar mensaje →
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
