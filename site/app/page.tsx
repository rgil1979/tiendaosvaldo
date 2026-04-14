import Image from "next/image"
import Link from "next/link"
import { getFeaturedProducts, MLProduct } from "@/lib/mercadolibre"
import { mlConfig, siteConfig } from "@/config/site.config"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

// [UX-FIX] Revalidar el home cada hora para no hacer fetch en frío en cada visita
export const revalidate = 3600

export default async function HomePage() {
  // Traemos productos destacados desde ML
  let products: MLProduct[] = []
  try {
    products = await getFeaturedProducts(8)
  } catch (e) {
    console.error("Error fetching products:", e)
  }

  // [UX-FIX] Categorías alineadas con el navbar para evitar inconsistencia de navegación
  const categories = [
    { name: "Perros", href: "/categoria/perros", emoji: "🐕", count: "2.400+" },
    { name: "Gatos", href: "/categoria/gatos", emoji: "🐈", count: "1.800+" },
    { name: "Accesorios", href: "/categoria/accesorios", emoji: "🦮", count: "680+" },
    { name: "Alimentación", href: "/categoria/alimentacion", emoji: "🍖", count: "950+" },
    { name: "Juguetes", href: "/categoria/juguetes", emoji: "🧸", count: "420+" },
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
              Encontrá accesorios, alimentos y juguetes seleccionados para perros y gatos. Todo disponible en Mercado Libre con envío a todo el país.
            </p>
            <div className={styles.heroActions}>
              <Link href="/categoria/perros" className="btn btn-fill">
                Ver productos →
              </Link>
              <Link href="/sobre-osvaldo" className="btn btn-ghost">
                Conocer a Osvaldo
              </Link>
            </div>
            <div className={styles.heroTrust}>
              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M11 6L7 10L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Comprás en Mercado Libre
              </div>
              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L8 14L14 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Envío a todo el país
              </div>
              <div className={styles.trustItem}>
                <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 5V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Pagos con Mercado Pago
              </div>
            </div>
          </div>

          {/* Card de Osvaldo */}
          <div className={styles.heroRight}>
            <div className={styles.osvaldoCard}>
              <div className={styles.osvaldoAvatar}>
                <Image
                  src={siteConfig.logo}
                  alt="Osvaldo"
                  fill
                  className={styles.osvaldoAvatarImg}
                />
              </div>
              <div className={styles.osvaldoLabel}>✅ Chief Sniff Officer</div>
              <h3 className={styles.osvaldoName}>Soy Osvaldo</h3>
              <div className={styles.osvaldoDesc}>
                Mestizo adoptado, 8 años. Probé cada categoría de esta tienda. Si no me copa, no lo publicamos.
              </div>
              {/* UX: Solo 1 métrica destacada en lugar de 3 */}
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
          {/* [UX-FIX] Eliminado catActive hardcodeado — no refleja estado real del usuario */}
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={styles.catCard}
            >
              <span className={styles.catEmoji}>{cat.emoji}</span>
              <div className={styles.catName}>{cat.name}</div>
              <div className={styles.catCount}>{cat.count} productos</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <div className={styles.productsBg}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              🔥 Más vendidos <span>esta semana</span>
            </h2>
            <Link href="/categoria/mascotas" className={styles.seeAll}>
              Ver todos →
            </Link>
          </div>
          {products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.slice(0, 8).map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={i === 0 ? "Top ventas" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className={styles.productsEmpty}>
              <p>Cargando productos...</p>
            </div>
          )}
          <div className={styles.productsMore}>
            <Link href="/categoria/mascotas" className="btn btn-ghost">
              Ver todos los productos
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
              No somos una tienda genérica. Osvaldo revisa cada categoría, filtramos por reputación de vendedor y calificaciones reales de compradores.
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
              { icon: "🛡️", title: "Comprás en Mercado Libre", desc: "Con toda la protección al comprador de ML" },
              { icon: "💳", title: "Pagos seguros", desc: "Tarjeta, efectivo y cuotas con Mercado Pago" },
              { icon: "📦", title: "Envíos con Mercado Envíos", desc: "Tracking en tiempo real a cualquier provincia" },
              { icon: "🔄", title: "Devoluciones sin drama", desc: "La política de devoluciones es la de Mercado Libre" },
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
      {/* [UX-FIX] Botón eliminado — sin backend activo no debe haber CTA de envío */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.nlIcon}>🐾</div>
          <h3 className={styles.nlTitle}>Ofertas directas de Osvaldo</h3>
          <p className={styles.nlDesc}>
            Cuando Osvaldo encuentra algo bueno, te avisa. Sin spam, sin pavadas.
          </p>
          <input
            type="email"
            placeholder="tu@email.com"
            className={styles.nlInput}
          />
        </div>
      </div>
    </>
  )
}
