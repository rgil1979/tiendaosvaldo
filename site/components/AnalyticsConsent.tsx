"use client"

import Link from "next/link"
import Script from "next/script"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { updateConsent } from "@/lib/analytics"
import styles from "./AnalyticsConsent.module.css"

const CONSENT_KEY = "tiendaosvaldo_cookie_consent"
type ConsentState = "accepted" | "rejected" | "pending"

export default function AnalyticsConsent({ gaId }: { gaId?: string }) {
  const [consent, setConsent] = useState<ConsentState>("pending")
  const [bannerVisible, setBannerVisible] = useState(false)
  const pathname = usePathname()

  // Restore saved consent on mount and update GA accordingly
  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY) as ConsentState | null
    if (saved === "accepted" || saved === "rejected") {
      setConsent(saved)
      if (saved === "accepted") updateConsent(true)
    } else {
      setBannerVisible(true)
    }
  }, [])

  // Allow footer link to reopen the banner after first decision
  useEffect(() => {
    function handleReopenBanner() {
      setBannerVisible(true)
    }
    window.addEventListener("show-cookie-banner", handleReopenBanner)
    return () => window.removeEventListener("show-cookie-banner", handleReopenBanner)
  }, [])

  // Track SPA page views on route change (only when accepted)
  useEffect(() => {
    if (consent !== "accepted" || !gaId) return
    window.gtag?.("config", gaId, {
      page_path: pathname,
      send_page_view: process.env.NODE_ENV === "production",
    })
  }, [pathname, consent, gaId])

  function handleConsent(next: Exclude<ConsentState, "pending">) {
    localStorage.setItem(CONSENT_KEY, next)
    setConsent(next)
    setBannerVisible(false)
    updateConsent(next === "accepted")
  }

  if (!gaId) return null

  return (
    <>
      {/* GA4 always loads — consent mode controls whether cookies are written */}
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: ${process.env.NODE_ENV === "production"}
          });
        `}
      </Script>

      {bannerVisible && (
        <div
          className={styles.banner}
          role="dialog"
          aria-live="polite"
          aria-label="Preferencias de cookies"
        >
          <div className={styles.copy}>
            <p className={styles.title}>Cookies de analítica</p>
            <p className={styles.text}>
              Usamos Google Analytics solo si aceptás para medir visitas y mejorar el sitio.
              Podés rechazarlo y seguir navegando normalmente. Leé más en nuestra{" "}
              <Link href="/privacidad">política de privacidad</Link>.
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
