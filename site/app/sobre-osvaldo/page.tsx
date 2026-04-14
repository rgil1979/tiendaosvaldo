import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Sobre Osvaldo",
  description: "La historia detrás de Tienda Osvaldo: cómo funciona y por qué confiamos en el criterio de un perro mestizo.",
}

export default function SobreOsvaldoPage() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroAvatar}>
            <Image src={siteConfig.logo} alt="Osvaldo" fill className={styles.heroAvatarImg} />
          </div>
          <h1 className={styles.heroTitle}>
            Hola, soy <span>Osvaldo.</span>
          </h1>
          <p className={styles.heroDesc}>
            Perro mestizo adoptado, 8 años. Probador oficial de productos y fundador involuntario de esta tienda.
          </p>
        </div>
      </div>

      <div className={styles.howWrap} id="como-funciona">
        <h2 className={styles.howTitle}>¿Cómo funciona?</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>
              <strong className={styles.stepTitle}>Explorás productos en nuestro sitio</strong>
              <p className={styles.stepDesc}>Navegás por categorías y filtrás lo que necesitás para tu mascota.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>2</div>
            <div>
              <strong className={styles.stepTitle}>Clic en "Ver en Mercado Libre"</strong>
              <p className={styles.stepDesc}>Te llevamos directo al vendedor original en ML. Nada se procesa acá.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div>
              <strong className={styles.stepTitle}>Comprás en Mercado Libre</strong>
              <p className={styles.stepDesc}>Con toda la protección de ML: pagos, envíos y devoluciones incluidas.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>4</div>
            <div>
              <strong className={styles.stepTitle}>Osvaldo recibe una comisión</strong>
              <p className={styles.stepDesc}>Somos afiliados de ML. No hay costo extra para vos, nunca.</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>¿Listo para hacer feliz a tu peludo?</h2>
          <div className={styles.ctaButtons}>
            <Link href="/categoria/mascotas" className="btn btn-fill">Ver todos los productos</Link>
            <Link href="/categoria/mascotas" className="btn btn-ghost">Ver todas las categorías</Link>
          </div>
        </div>
      </div>
    </>
  )
}
