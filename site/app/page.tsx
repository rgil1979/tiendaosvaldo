import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { productosCurados } from "@/data/productos-curados"
import ProductCard from "@/components/ProductCard"
import styles from "./page.module.css"

export default function HomePage() {
  const categories = [
    { name: "Alimento perro", href: "/categoria/alimento-perro", emoji: "🍖" },
    { name: "Alimento gato",  href: "/categoria/alimento-gato",  emoji: "🐟" },
    { name: "Collares",       href: "/categoria/collares",        emoji: "🦮" },
    { name: "Camas",          href: "/categoria/camas",           emoji: "🛏️" },
    { name: "Arena gato",     href: "/categoria/arena-gato",      emoji: "🧂" },
  ]

  const perros = productosCurados.filter(p =>
    ["collares", "camas", "juguetes", "accesorios"].includes(p.categoria) &&
    p.mascota === "perro"
  ).slice(0, 8)

  const gatos = productosCurados.filter(p =>
    ["collares", "camas", "juguetes", "accesorios"].includes(p.categoria) &&
    p.mascota === "gato"
  ).slice(0, 8)

  const accesorios = productosCurados.filter(p => p.categoria === "accesorios")
  const totalProductos = productosCurados.length

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
                <span className={styles.statNum}>{totalProductos}</span>
                <span className={styles.statLabel}>productos aprobados por Osvaldo</span>
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

      {/* ── PERROS ── */}
      <div className={styles.productsBg}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🐕 Para <span>perros</span></h2>
            <Link href="/categoria/perros" className={styles.seeAll}>Ver más →</Link>
          </div>
          <div className={styles.grid4}>
            {perros.map((p) => (
              <ProductCard key={p.id} product={{
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
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── GATOS ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🐈 Para <span>gatos</span></h2>
          <Link href="/categoria/gatos" className={styles.seeAll}>Ver más →</Link>
        </div>
        <div className={styles.grid4}>
          {gatos.map((p) => (
            <ProductCard key={p.id} product={{
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
            }} />
          ))}
        </div>
      </div>

      {/* ── ACCESORIOS ── */}
      <div className={styles.productsBg}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎒 <span>Accesorios</span></h2>
            <Link href="/categoria/accesorios" className={styles.seeAll}>Ver más →</Link>
          </div>
          <div className={styles.grid4}>
            {accesorios.map((p) => (
              <ProductCard key={p.id} product={{
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
              }} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
