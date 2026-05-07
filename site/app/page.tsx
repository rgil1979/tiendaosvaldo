import { cache, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { getHighlights, getProductsVariety, getCatProductsVariety, getAccessoriesVariety, getPetsHighlights } from "@/lib/mercadolibre"
import type { MLProductFull } from "@/lib/mercadolibre"
import ProductCard from "@/components/ProductCard"
import Carousel from "@/components/Carousel"
import CarouselGatos from "@/components/CarouselGatos"
import CarouselAccesorios from "@/components/CarouselAccesorios"
import CarouselMascotas from "@/components/CarouselMascotas"
import styles from "./page.module.css"

export const revalidate = 3600

// cache() deduplica llamadas idénticas dentro del mismo render — evita pedir
// dos veces el mismo endpoint y que los mismos productos aparezcan en dos secciones.
const getHighlightsCached = cache(getHighlights)
const getProductsVarietyCached = cache(getProductsVariety)
const getCatProductsVarietyCached = cache(getCatProductsVariety)
const getAccessoriesVarietyCached = cache(getAccessoriesVariety)
const getPetsHighlightsCached = cache(getPetsHighlights)

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
  const [dogFood, catFood] = await Promise.all([
    getHighlightsCached("MLA434760", 8),
    getHighlightsCached("MLA1081",   8),
  ])
  // Intercala perro/gato → 8 productos (2 slides de 4)
  const products: MLProductFull[] = []
  for (let i = 0; i < 4 && products.length < 8; i++) {
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
        <Carousel products={products} itemsPerView={4} />
      </div>
    </div>
  )
}

async function PerrosSection() {
  const dogCategories = [
    "MLA434760", // Comida
    "MLA434757", // Juguetes
    "MLA370459", // Pretales
    "MLA1076",   // Platos
    "MLA434758", // Camas
    "MLA434759", // Accesorios
  ]

  const products = await getProductsVarietyCached(dogCategories, 12)
  if (!products.length) return null

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🐕 Para <span>perros</span></h2>
        <Link href="/categoria/perros" className={styles.seeAll}>
          Ver más →
        </Link>
      </div>
      <Carousel products={products} itemsPerView={4} />
    </div>
  )
}

async function GatosSection() {
  const products = await getCatProductsVarietyCached(12)
  if (!products.length) return null

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🐈 Para <span>gatos</span></h2>
        <Link href="/categoria/gatos" className={styles.seeAll}>
          Ver más →
        </Link>
      </div>
      <CarouselGatos products={products} itemsPerView={4} />
    </div>
  )
}

async function PetsHighlightsSection() {
  const products = await getPetsHighlightsCached(12)
  if (!products.length) return null

  return (
    <div className={styles.productsBg}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🐾 Lo mejor para tus <span>mascotas</span></h2>
          <Link href="/categoria/mascotas" className={styles.seeAll}>Ver todos →</Link>
        </div>
        <CarouselMascotas products={products} itemsPerView={4} scrollStep={2} />
      </div>
    </div>
  )
}

async function AccesoriosSection() {
  const products = await getAccessoriesVarietyCached(12)
  if (!products.length) return null

  return (
    <div className={styles.productsBg}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🎒 <span>Accesorios</span> y collares</h2>
          <Link href="/categoria/accesorios" className={styles.seeAll}>Ver todos →</Link>
        </div>
        <CarouselAccesorios products={products} itemsPerView={4} />
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

      {/* ── MASCOTAS DESTACADOS ── */}
      <Suspense fallback={
        <div className={styles.productsBg}>
          <div className={styles.section}>
            <SectionSkeleton count={4} />
          </div>
        </div>
      }>
        <PetsHighlightsSection />
      </Suspense>

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

    </>
  )
}
