import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Sobre Osvaldo",
  description: "La historia detras de Tienda Osvaldo.",
}

export default function SobreOsvaldoPage() {
  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroAvatar}>
            <Image src={siteConfig.logo} alt="Osvaldo" fill className={styles.heroAvatarImg} />
          </div>
          <h1 className={styles.heroTitle}>
            Hola, soy <span>Osvaldo.</span>
          </h1>
          <p className={styles.heroDesc}>
            Perro mestizo adoptado, 8 anos. Probador oficial de productos.
          </p>
        </div>
      </div>
      <div className={styles.howWrap} id="como-funciona">
        <h2 className={styles.howTitle}>Como funciona</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>
              <strong className={styles.stepTitle}>Explorás productos en nuestro sitio</strong>
              <p className={styles.stepDesc}>Navegas por categorias y filtras lo que necesitas.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div>
              <strong className={styles.stepTitle}>Clic en Ver en Mercado Libre</strong>
              <p className={styles.stepDesc}>Te llevamos directo al vendedor original en ML.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div>
              <strong className={styles.stepTitle}>Compras en Mercado Libre</strong>
              <p className={styles.stepDesc}>Con toda la proteccion de ML: pagos, envios y devoluciones.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div>
              <strong className={styles.stepTitle}>Osvaldo recibe una comision</strong>
              <p className={styles.stepDesc}>Somos afiliados de ML sin costo extra para vos.</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Listo para hacer feliz a tu peludo?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/categoria/mascotas" className="btn btn-fill">Ver productos</Link>
            <Link href="/categoria/perros" className="btn btn-ghost">Ver perros</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
