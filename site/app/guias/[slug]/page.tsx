import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ogBase } from "@/config/site.config"
import { productosCurados } from "@/data/productos-curados"
import { GUIAS } from "@/data/guias"
import ProductCard from "@/components/ProductCard"

interface Props {
  params: Promise<{ slug: string }>
}

// Convierte el contenido de la guía (markdown simple, escrito por nosotros) a HTML.
// Soporta: ## y ### títulos, **negrita**, *cursiva*, [links](https://…), listas con "- ",
// separador "---" y párrafos separados por una línea en blanco.
function renderContenido(md: string): string {
  return md
    .trim()
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.3rem;font-family:var(--font-body);font-weight:700;margin:2rem 0 0.75rem;color:#3D1F0D">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-family:var(--font-body);font-weight:600;margin:1.5rem 0 0.5rem;color:#3D1F0D">$1</h3>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #eee;margin:2rem 0"/>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:)]|$)/gm, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#E8622A">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:0.3rem">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:1.5rem;margin:0.5rem 0">$&</ul>')
    .replace(/\n\n/g, "<br/><br/>")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guia = GUIAS[slug]
  if (!guia) return { robots: { index: false, follow: false } }
  return {
    title:       guia.tituloSeo ? { absolute: guia.tituloSeo } : guia.titulo,
    description: guia.descripcion,
    openGraph: {
      ...ogBase,
      title:       guia.tituloSeo ?? `${guia.titulo} — Tienda Osvaldo`,
      description: guia.descripcion,
    },
    alternates: { canonical: `/guias/${slug}` },
    robots: { index: true, follow: true },
  }
}

export function generateStaticParams() {
  return Object.keys(GUIAS).map((slug) => ({ slug }))
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params
  const guia = GUIAS[slug]
  if (!guia) notFound()

  const productosRelacionados = guia.productosRelacionados
    .map((id) => productosCurados.find((p) => p.id === id))
    .filter(Boolean)

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link href="/guias" style={{ color: "#E8622A", textDecoration: "none", fontSize: "0.9rem" }}>
        ← Volver a guías
      </Link>
      <h1 style={{ fontSize: "1.75rem", fontFamily: "var(--font-body)", fontWeight: 700, lineHeight: 1.3, margin: "1rem 0 0.5rem", color: "#3D1F0D" }}>
        {guia.titulo}
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
        {guia.descripcion}
      </p>

      <div
        style={{ lineHeight: 1.8, color: "#3D1F0D" }}
        dangerouslySetInnerHTML={{ __html: renderContenido(guia.contenido) }}
      />

      {productosRelacionados.length > 0 && (
        <div style={{ marginTop: "3rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#3D1F0D" }}>
            🐾 Los productos de esta guía
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {productosRelacionados.map((p) => p && (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.titulo,
                  pictures: [{ id: "0", url: p.imagen }],
                  affiliateUrl: guia.linksEtiquetados?.[p.id] ?? p.linkAfiliado,
                  price: 0,
                  condition: "new" as const,
                  free_shipping: false,
                  accepts_mercadopago: false,
                  currency_id: "ARS",
                  short_description: "",
                  main_features: [],
                  attributes: [],
                  domain_id: "",
                  status: "active",
                  item_id: p.id,
                  warranty: null,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
