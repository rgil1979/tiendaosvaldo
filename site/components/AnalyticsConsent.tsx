"use client"

import Link from "next/link"
import Script from "next/script"
import { useEffect, useState } from "react"
import styles from "./AnalyticsConsent.module.css"

const CONSENT_STORAGE_KEY = "tiendaosvaldo_cookie_consent"

type ConsentState = "accepted" | "rejected" | "pending"

export default function AnalyticsConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<ConsentState>("pending")

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY)

    if (savedConsent === "accepted" || savedConsent === "rejected") {
      setConsent(savedConsent)
      return
    }

    setConsent("pending")
  }, [])

  function handleConsent(nextConsent: Exclude<ConsentState, "pending">) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, nextConsent)
    setConsent(nextConsent)
  }

  if (!gaId) {
    return null
  }

  const shouldLoadAnalytics = consent === "accepted"

  return (
    <>
      {shouldLoadAnalytics && (
        <>
          <Script
            id="ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', { analytics_storage: 'granted' });
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {consent === "pending" && (
        <div
          className={styles.banner}
          role="dialog"
          aria-live="polite"
          aria-label="Preferencias de cookies"
        >
          <div className={styles.copy}>
            <p className={styles.title}>Cookies de analitica</p>
            <p className={styles.text}>
              Usamos Google Analytics solo si aceptas para medir visitas y mejorar
              el sitio. Podes rechazarlo y seguir navegando normalmente. Lee mas en
              nuestra <Link href="/privacidad">politica de privacidad</Link>.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondary}
              onClick={() => handleConsent("rejected")}
            >
              Rechazar
            </button>
            <button
              type="button"
              className={styles.primary}
              onClick={() => handleConsent("accepted")}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  )
}