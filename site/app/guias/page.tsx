import { Metadata } from "next"
import Link from "next/link"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Guías para mascotas",
  description: "Guías y comparativas para elegir los mejores productos para tu perro o gato. Aprobadas por Osvaldo.",
  openGraph: { title: "Guías para mascotas — Tienda Osvaldo" },
}

const guias = [
  {
    slug: "mejor-alimento-perro-adulto-raza-grande-argentina-2026",
    titulo: "Mejor alimento para perro adulto raza grande Argentina 2026",
    descripcion: "Comparativa real de las mejores marcas disponibles en Argentina: Royal Canin, Pro Plan, Eukanuba y más.",
    emoji: "🐕",
  },
]

export default function GuiasPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Guías de Osvaldo</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Todo lo que necesitás saber antes de comprar, sin rodeos.
      </p>
      {guias.map((g) => (
        <Link key={g.slug} href={`/guias/${g.slug}`} style={{ display: "block", textDecoration: "none", marginBottom: "1.5rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "12px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{g.emoji}</div>
          <h2 style={{ fontSize: "1.15rem", fontFamily: "var(--font-body)", fontWeight: 700, lineHeight: 1.4, color: "#3D1F0D", marginBottom: "0.5rem" }}>{g.titulo}</h2>
          <p style={{ color: "#666", margin: 0 }}>{g.descripcion}</p>
        </Link>
      ))}
    </div>
  )
}
