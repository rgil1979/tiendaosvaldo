"use client"

import { useState } from "react"
import styles from "../legal.module.css"

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

export default function ContactForm() {
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
        method:  "POST",
        body:    data,
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

  if (status === "success") {
    return (
      <div className={styles.highlight}>
        <p>✅ ¡Mensaje enviado! Te respondemos en 24–48 horas hábiles.</p>
      </div>
    )
  }

  return (
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
  )
}
