// ─────────────────────────────────────────────
// UTILIDADES COMPARTIDAS — TIENDA OSVALDO
// ─────────────────────────────────────────────

/**
 * Convierte un rating numérico en estrellas llenas/vacías (escala 1–5).
 * Ejemplo: 4.3 → "████☆"
 */
export function renderStars(rating: number): string {
  const full  = Math.round(rating)
  const empty = 5 - full
  return "★".repeat(full) + "☆".repeat(empty)
}
