"use client"

export default function CookiePreferencesLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("show-cookie-banner"))}
    >
      Preferencias de cookies
    </button>
  )
}
