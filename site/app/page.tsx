import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { getHighlights } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import ProductCard from "@/components/ProductCard"
import ProductCarousel from "@/components/ProductCarousel"
import styles from "./page.module.css"

// ISR: revalidar cada hora
export const revalidate = 3600

// ── SECCIONES ASYNC (Server Components) ──────────────────────────────────────

async function ProductSection({
  categoryId, limit, cols,
}: {
  categoryId: string
  limit:      number
  cols:       2 | 4
}) {
  const products = await getHighlights(categoryId, limit)
  if (!products.length) return null

  const gridClass = cols === 4 ? styles.grid4 : styles.grid2

  return (
    <div className={gridClass}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} badge={i === 0 ? "Recomendado" : undefined} />
      ))}
    </div>
  )
}

async function CarouselSection() {
  // Combina paseo/viaje + higiene para garantizar 8 productos con precio
  const [a, b] = await Promise.all([
    getHighlights("MLA434764", 10), // paseo y viaje
    getHighlights("MLA1076",   10), // higiene y estética
  ])
  // Mezcla alternada para tener variedad de categorías
  const merged: typeof a = []
  const maxLen = Math.max(a.length, b.length)
  for (let i = 0; i < maxLen && merged.length < 8; i++) {
    if (a[i]) merged.push(a[i])
    if (merged.length < 8 && b[i]) merged.push(b[i])
  }
  if (!merged.length) return null
  return <ProductCarousel products={merged} visibleCount={5} />
}

// Toma 1 producto aleatorio de cada categoría → 4 productos de categorías distintas
async function FeaturedSection() {
  const CATEGORIES = ["MLA1072", "MLA1081", "MLA434764", "MLA1074"] // perros, gatos, paseo, juguetes
  const pools = await Promise.all(CATEGORIES.map((id) => getHighlights(id, 10)))

  const featured: MLProductFull[] = pools
    .map((pool) => pool[Math.floor(Math.random() * pool.length)])
    .filter(Boolean)

  if (!featured.length) return null

  return (
    <div className={styles.grid4}>
      {featured.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

function ProductSkeleton({ count, cols }: { count: number; cols: 2 | 4 }) {
  const gridClass = cols === 4 ? styles.grid4 : styles.grid2
  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  )
}

// ── HOME ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const categories = [
    { name: "Alimento perro", href: "/categoria/alimento-perro", emoji: "🍖" },
    { name: "Alimento gato",  href: "/categoria/alimento-gato",  emoji: "🐟" },
    { name: "Collares",       href: "/categoria/collares",        emoji: "🦮" },
    { name: "Camas",          href: "/categoria/camas",           emoji: "🛏️" },
    { name: "Arena gato",     href: "/categoria/arena-gato",      emoji: "🧂" },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <div className={styles.heroBg}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroEyebrow}>
              🐶 Aprobado por Osvaldo, un perro mestizo con criterio
            </div>
            <h1 className={styles.heroTitle}>
              Lo mejor para<br />tus <span>peludos</span>,<br />sin vueltas.
            </h1>
            <p className={styles.heroSub}>
              Encontrá accesorios, alimentos y juguetes seleccionados para perros y gatos.
              Todo disponible en Mercado Libre con envío a todo el país.
            </p>
            <div className={styles.heroActions}>
              <Link href="/categoria/alimento-perro" className="btn btn-fill">
                Ver productos →
              </Link>
              <Link href="/sobre-osvaldo" className="btn btn-ghost">
                Conocer a Osvaldo
              </Link>
            </div>
            <div className={styles.heroTrust}>
              {[
                { icon: "✓", text: "Comprás en Mercado Libre" },
                { icon: "✓", text: "Envío a todo el país" },
                { icon: "✓", text: "Pagos con Mercado Pago" },
              ].map((t) => (
                <div key={t.text} className={styles.trustItem}>
                  <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M11 6L7 10L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* Card de Osvaldo */}
          <div className={styles.heroRight}>
            <div className={styles.osvaldoCard}>
              <div className={styles.osvaldoAvatar}>
                <Image src={siteConfig.logo} alt="Osvaldo" fill className={styles.osvaldoAvatarImg} />
              </div>
              <div className={styles.osvaldoLabel}>✅ Chief Sniff Officer</div>
              <h3 className={styles.osvaldoName}>Soy Osvaldo</h3>
              <div className={styles.osvaldoDesc}>
                Mestizo adoptado, 8 años. Probé cada categoría de esta tienda.
                Si no me copa, no lo publicamos.
              </div>
              <div className={styles.statSingle}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>productos aprobados</span>
              </div>
              <Link href="/sobre-osvaldo#como-funciona" className="btn btn-fill">
                🛍 Cómo funciona →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── CATEGORÍAS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Explorá por <span>categoría</span>
          </h2>
          <Link href="/categoria/mascotas" className={styles.seeAll}>
            Ver todas →
          </Link>
        </div>
        <div className={styles.catsGrid}>
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className={styles.catCard}>
              <span className={styles.catEmoji}>{cat.emoji}</span>
              <div className={styles.catName}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DESTACADOS ── */}
      <div className={styles.productsBg}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              🌟 Destacados para tu <span>mascota</span>
            </h2>
            <Link href="/categoria/mascotas" className={styles.seeAll}>Ver todos →</Link>
          </div>
          <Suspense fallback={<ProductSkeleton count={4} cols={4} />}>
            <FeaturedSection />
          </Suspense>
        </div>
      </div>

      {/* ── PERROS + GATOS ── */}
      <div className={styles.section}>
        <div className={styles.twoCol}>
          {/* Para perros */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🐕 Para <span>perros</span></h2>
              <Link href="/categoria/perros" className={styles.seeAll}>Ver más →</Link>
            </div>
            <Suspense fallback={<ProductSkeleton count={1} cols={2} />}>
              <ProductSection categoryId="MLA1072" limit={1} cols={2} />
            </Suspense>
          </div>

          {/* Para gatos */}
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>🐈 Para <span>gatos</span></h2>
              <Link href="/categoria/gatos" className={styles.seeAll}>Ver más →</Link>
            </div>
            <Suspense fallback={<ProductSkeleton count={1} cols={2} />}>
              <ProductSection categoryId="MLA1081" limit={1} cols={2} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ── ACCESORIOS ── */}
      <div className={styles.productsBg}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              🦮 <span>Accesorios</span> y collares
            </h2>
            <Link href="/categoria/collares" className={styles.seeAll}>Ver todos →</Link>
          </div>
          <Suspense fallback={<ProductSkeleton count={5} cols={4} />}>
            <CarouselSection />
          </Suspense>
          <div className={styles.productsMore}>
            <Link href="/categoria/collares" className="btn btn-ghost">
              Ver todos los accesorios
            </Link>
          </div>
        </div>
      </div>

      {/* ── BANNER OSVALDO ── */}
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <div>
            <h2 className={styles.bannerTitle}>
              ¿Por qué confiar<br />en la selección<br />de <span>Osvaldo?</span>
            </h2>
            <p className={styles.bannerDesc}>
              No somos una tienda genérica. Osvaldo revisa cada categoría, filtramos
              por reputación de vendedor y calificaciones reales de compradores.
            </p>
            <div className={styles.bannerPills}>
              <span className={styles.bannerPill}>🐾 Solo rep. verde en ML</span>
              <span className={styles.bannerPill}>⭐ 4+ estrellas</span>
              <span className={styles.bannerPill}>🚚 Envío a todo el país</span>
              <span className={styles.bannerPill}>🔄 Precios en tiempo real</span>
            </div>
            <Link href="/sobre-osvaldo" className="btn btn-fill">
              Conocer a Osvaldo →
            </Link>
          </div>
          <div className={styles.bannerRight}>
            {[
              { icon: "🛡️", title: "Comprás en Mercado Libre",      desc: "Con toda la protección al comprador de ML" },
              { icon: "💳", title: "Pagos seguros",                  desc: "Tarjeta, efectivo y cuotas con Mercado Pago" },
              { icon: "📦", title: "Envíos con Mercado Envíos",      desc: "Tracking en tiempo real a cualquier provincia" },
              { icon: "🔄", title: "Devoluciones sin drama",         desc: "La política de devoluciones es la de Mercado Libre" },
            ].map((item) => (
              <div key={item.title} className={styles.bannerItem}>
                <div className={styles.bannerIcon}>{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.nlIcon}>🐾</div>
          <h3 className={styles.nlTitle}>Ofertas directas de Osvaldo</h3>
          <p className={styles.nlDesc}>
            Cuando Osvaldo encuentra algo bueno, te avisa. Sin spam, sin pavadas.
          </p>
          <input type="email" placeholder="tu@email.com" className={styles.nlInput} />
        </div>
      </div>
    </>
  )
}
