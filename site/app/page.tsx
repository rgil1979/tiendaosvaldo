import { cache, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { getHighlights } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

export const revalidate = 3600

// cache() deduplica llamadas idénticas dentro del mismo render — evita pedir
// dos veces el mismo endpoint y que los mismos productos aparezcan en dos secciones.
const getHighlightsCached = cache(getHighlights)

// ── SKELETON ─────────────────────────────────────────────────────────────────

function SectionSkeleton({ count }: { count: number }) {
  return (
    <div className={styles.grid4}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  )
}

// ── SECCIONES ASYNC ───────────────────────────────────────────────────────────

async function FeaturedSection() {
  // Pedimos 6 de cada categoría: los primeros 2 de cada una van a Destacados,
  // los restantes 4 van a PerrosSection / GatosSection sin repetición.
  const [dogFood, catFood] = await Promise.all([
    getHighlightsCached("MLA434760", 6),
    getHighlightsCached("MLA1081",   6),
  ])
  // Intercala dog[0], cat[0], dog[1], cat[1] → 4 productos sin repetir con las secciones de abajo
  const products: MLProductFull[] = []
  for (let i = 0; i < 2 && products.length < 4; i++) {
    if (dogFood[i]) products.push(dogFood[i])
    if (catFood[i]) products.push(catFood[i])
  }
  if (!products.length) return null

  return (
    <div className={styles.productsBg}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🌟 Destacados para tu <span>mascota</span></h2>
          <Link href="/categoria/mascotas" className={styles.seeAll}>Ver todos →</Link>
        </div>
        <div className={styles.grid4}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}

async function PerrosSection() {
  // Misma llamada cacheada que FeaturedSection — sin request extra al API.
  // Empieza en índice 2 para no repetir los que ya mostró Destacados.
  const all = await getHighlightsCached("MLA434760", 6)
  const products = all.slice(2)
  if (!products.length) return null

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🐕 Para <span>perros</span></h2>
        <Link href="/categoria/perros" className={styles.seeAll}>Ver más →</Link>
      </div>
      <div className={styles.grid4}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

async function GatosSection() {
  // Misma llamada cacheada que FeaturedSection — sin request extra al API.
  // Empieza en índice 2 para no repetir los que ya mostró Destacados.
  const all = await getHighlightsCached("MLA1081", 6)
  const products = all.slice(2)
  if (!products.length) return null

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🐈 Para <span>gatos</span></h2>
        <Link href="/categoria/gatos" className={styles.seeAll}>Ver más →</Link>
      </div>
      <div className={styles.grid4}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

async function AccesoriosSection() {
  // MLA370459 = correas/paseo, MLA1076 = higiene/estética — ambas retornan productos con precio
  const [paseo, higiene] = await Promise.all([
    getHighlightsCached("MLA370459", 4),
    getHighlightsCached("MLA1076",   4),
  ])
  const merged: typeof paseo = []
  for (let i = 0; i < 4 && merged.length < 4; i++) {
    if (paseo[i])                     merged.push(paseo[i])
    if (merged.length < 4 && higiene[i]) merged.push(higiene[i])
  }
  const products = merged
  if (!products.length) return null

  return (
    <div className={styles.productsBg}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🎒 <span>Accesorios</span> y collares</h2>
          <Link href="/categoria/accesorios" className={styles.seeAll}>Ver todos →</Link>
        </div>
        <div className={styles.grid4}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className={styles.productsMore}>
          <Link href="/categoria/accesorios" className="btn btn-ghost">
            Ver todos los accesorios
          </Link>
        </div>
      </div>
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
      <Suspense fallback={
        <div className={styles.productsBg}>
          <div className={styles.section}>
            <SectionSkeleton count={4} />
          </div>
        </div>
      }>
        <FeaturedSection />
      </Suspense>

      {/* ── PERROS ── */}
      <Suspense fallback={
        <div className={styles.section}>
          <SectionSkeleton count={4} />
        </div>
      }>
        <PerrosSection />
      </Suspense>

      {/* ── GATOS ── */}
      <Suspense fallback={
        <div className={styles.section}>
          <SectionSkeleton count={4} />
        </div>
      }>
        <GatosSection />
      </Suspense>

      {/* ── ACCESORIOS ── */}
      <Suspense fallback={
        <div className={styles.productsBg}>
          <div className={styles.section}>
            <SectionSkeleton count={4} />
          </div>
        </div>
      }>
        <AccesoriosSection />
      </Suspense>

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

    </>
  )
}
