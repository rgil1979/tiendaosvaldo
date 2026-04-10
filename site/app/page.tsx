import Image from "next/image"
import Link from "next/link"
import { getFeaturedProducts, MLProduct } from "@/lib/mercadolibre"
import { mlConfig, siteConfig } from "@/config/site.config"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

export default async function HomePage() {
  // Traemos productos destacados desde ML
  let products: MLProduct[] = []
  try {
    products = await getFeaturedProducts(8)
  } catch (e) {
    console.error("Error fetching products:", e)
  }

  const categories = [
    { name: "Perros", href: "/categoria/perros", emoji: "🐕", count: "2.400+" },
    { name: "Gatos", href: "/categoria/gatos", emoji: "🐈", count: "1.800+" },
    { name: "Paseo", href: "/categoria/paseo", emoji: "🦮", count: "680+" },
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
                <div className={styles.trustDot} />
                Comprás en Mercado Libre
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustDot} />
                Envío a todo el país
              </div>
              <div className={styles.trustItem}>
                <div className={styles.trustDot} />
                Pagos con Mercado Pago
              </div>
            </div>
          </div>

          {/* Card de Osvaldo */}
          <div className={styles.heroRight}>
            <div className={styles.floatingTagTop}>🌟 +500 productos aprobados</div>
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
              <p className={styles.osvaldoDesc}>
                Mestizo adoptado, 8 años. Probé cada categoría de esta tienda. Si no me copa, no lo publicamos.
              </p>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>500+</span>
                  <span className={styles.statLabel}>Productos</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>5★</span>
                  <span className={styles.statLabel}>Solo los mejores</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>24/7</span>
                  <span className={styles.statLabel}>Disponible</span>
                </div>
              </div>
            </div>
            <div className={styles.floatingTagBottom}>🛍 Afiliados de Mercado Libre</div>
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
          {categories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`${styles.catCard} ${i === 0 ? styles.catActive : ""}`}
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
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.nlIcon}>🐾</div>
          <h3 className={styles.nlTitle}>Ofertas directas de Osvaldo</h3>
          <p className={styles.nlDesc}>
            Cuando Osvaldo encuentra algo bueno, te avisa. Sin spam, sin pavadas.
          </p>
          <div className={styles.nlForm}>
            <input
              type="email"
              placeholder="tu@email.com"
              className={styles.nlInput}
            />
            <button className="btn btn-fill">Suscribirme</button>
          </div>
        </div>
      </div>
    </>
  )
}
