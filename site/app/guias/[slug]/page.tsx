import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { productosCurados } from "@/data/productos-curados"
import ProductCard from "@/components/ProductCard"

interface Props {
  params: Promise<{ slug: string }>
}

const GUIAS: Record<string, {
  titulo: string
  descripcion: string
  contenido: string
  productosRelacionados: string[]
}> = {
  "mejor-alimento-perro-adulto-raza-grande-argentina-2026": {
    titulo: "Mejor alimento para perro adulto raza grande Argentina 2026",
    descripcion: "Comparativa real de las mejores marcas disponibles en Argentina: Royal Canin, Pro Plan, Eukanuba y más.",
    productosRelacionados: ["col-p-001", "cam-p-001", "jug-p-001"],
    contenido: `
## Por qué el alimento importa más de lo que pensás

Los perros de raza grande tienen necesidades nutricionales específicas que los diferencian del resto. Su desarrollo óseo, la salud articular y el control del peso corporal dependen directamente de la calidad del alimento que reciben.

Osvaldo lo aprendió de la manera difícil: un par de marcas genéricas y mucho tiempo en el veterinario. Hoy come solo lo que pasa el corte.

## Qué mirar en la etiqueta (y qué ignorar)

**Lo que importa:**
- Proteína animal como primer ingrediente (pollo, res, cordero — no "harina de subproductos")
- Porcentaje de proteína: mínimo 22% para adultos, 25%+ para razas activas
- Glucosamina y condroitina para articulaciones (crítico en razas grandes)
- Calcio y fósforo balanceados: exceso de calcio acelera el crecimiento y daña las articulaciones

**Lo que podés ignorar:**
- "Natural", "premium", "gourmet" — no tienen definición legal en Argentina
- Colores del packaging — no dice nada sobre la calidad

## Las marcas más vendidas en Argentina: análisis real

### Royal Canin Maxi Adult
La opción más conocida y más vendida. Formulada específicamente para razas de 26 a 44 kg.

**Lo bueno:** croqueta grande que obliga a masticar despacio, fórmula probada durante años, fácil de conseguir en todo el país.

**Lo no tan bueno:** precio alto y el primer ingrediente es maíz, no proteína animal. Para muchos perros funciona bien igual, pero hay opciones con mejor composición al mismo precio.

**Veredicto de Osvaldo:** ✅ Confiable. No la más eficiente en costo-beneficio, pero no falla.

### Pro Plan Large Breed Adult
Proteína de pollo como primer ingrediente. Incluye glucosamina y EPA para articulaciones.

**Lo bueno:** mejor perfil nutricional que Royal Canin en papel, proteína animal al frente, omega-3 incluido.

**Lo no tan bueno:** precio similar a Royal Canin, disponibilidad variable según la región.

**Veredicto de Osvaldo:** ✅ La mejor relación composición/precio del segmento premium.

### Eukanuba Large Breed Adult
Menos conocida pero sólida. Pollo como primer ingrediente, tecnología de control de sarro dental.

**Lo bueno:** composición honesta, precio levemente inferior a las dos anteriores.

**Lo no tan bueno:** distribución más limitada — no siempre está en todos los pet shops.

**Veredicto de Osvaldo:** ✅ Buena opción si la conseguís cerca.

## ¿Cuánto debería comer un perro grande?

La respuesta honesta: depende del peso, la actividad y el metabolismo de tu perro. Las tablas del envase son un punto de partida, no una regla.

Regla práctica: si podés palpar las costillas sin presionar pero no las ves, el peso está bien. Si tenés que presionar fuerte, está excedido.

## Dónde comprar en Argentina

Todas las marcas de esta guía están disponibles en Mercado Libre con envío a todo el país. Los precios varían constantemente — siempre revisá el precio actual antes de comprar.

## Fuentes

- [Royal Canin Maxi Adult — Ficha técnica oficial Argentina](https://www.royalcanin.com/ar/dogs/products/retail-products/maxi-adult-3007)
- [Pro Plan Adult Large Breed — Sitio oficial Purina Argentina](https://www.purina.com.ar/proplan/perros/adulto/razas-grandes)
- [Ingredientes Pro Plan Large Breed (distribuidor certificado)](https://www.etra.com.ar/super-premium-perro/403-pro-plan-adult-large-breed-x-3-kg.html)

---

*Esta guía está basada en las fichas técnicas oficiales de cada marca y no reemplaza la consulta con un médico veterinario. Los precios varían constantemente — siempre verificá el precio actual en Mercado Libre antes de comprar. Última actualización: junio 2026.*
    `,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guia = GUIAS[slug]
  if (!guia) return { robots: { index: false, follow: false } }
  return {
    title: `${guia.titulo} — Tienda Osvaldo`,
    description: guia.descripcion,
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
        dangerouslySetInnerHTML={{
          __html: guia.contenido
            .trim()
            .replace(/^## (.+)$/gm, '<h2 style="font-size:1.3rem;font-family:var(--font-body);font-weight:700;margin:2rem 0 0.75rem;color:#3D1F0D">$1</h2>')
            .replace(/^### (.+)$/gm, '<h3 style="font-size:1.1rem;font-family:var(--font-body);font-weight:600;margin:1.5rem 0 0.5rem;color:#3D1F0D">$1</h3>')
            .replace(/^\*\*(.+?)\*\*$/gm, '<strong>$1</strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.+)$/gm, '<li style="margin-bottom:0.3rem">$1</li>')
            .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:1.5rem;margin:0.5rem 0">$&</ul>')
            .replace(/\n\n/g, '<br/><br/>')
        }}
      />

      {productosRelacionados.length > 0 && (
        <div style={{ marginTop: "3rem", borderTop: "1px solid #eee", paddingTop: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#3D1F0D" }}>
            🐾 Productos aprobados por Osvaldo
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {productosRelacionados.map((p) => p && (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.titulo,
                  pictures: [{ id: "0", url: p.imagen }],
                  affiliateUrl: p.linkAfiliado,
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
