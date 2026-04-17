// ─────────────────────────────────────────────
// CONFIGURACIÓN CENTRAL — TIENDA OSVALDO
// Todos los valores configurables del sitio
// ─────────────────────────────────────────────

export const siteConfig = {
  // ── INFORMACIÓN DEL SITIO ──
  name: "Tienda Osvaldo",
  description: "El pet shop aprobado por Osvaldo. Los mejores productos para perros y gatos, seleccionados con criterio canino.",
  url: "https://tiendaosvaldo.com.ar",
  logo: "/img/logo.jpeg",
  favicon: "/img/favicon.ico",
  locale: "es-AR",

  // ── OSVALDO ──
  osvaldo: {
    raza: "Mestizo adoptado",
    edad: "8 años",
    descripcionCorta: "Perro mestizo adoptado, 8 años. Probador oficial de productos y fundador involuntario de esta tienda.",
    bio: [
      "Osvaldo llegó a casa hace 8 años y desde entonces es el responsable de todas las decisiones importantes: qué arnés usar, qué snack comer, qué juguete comprar.",
      "Su criterio de selección es simple: si lo ignora o lo destruye en 5 minutos, no pasa el corte. Si lo usa todos los días y nos mira con esos ojos cuando queremos sacárselo, va directo a la tienda.",
      "También acepta sobornos en forma de premios de pollo.",
    ],
    tags: ["Mestizo adoptado", "8 años", "Le encanta el parque", "Odia los globos"],
  },

  // ── REDES SOCIALES ──
  social: {
    instagram: "https://instagram.com/tiendaosvaldo",
    instagramHandle: "@tiendaosvaldo",
  },

  // ── CONTACTO ──
  contact: {
    email: "hola@tiendaosvaldo.com.ar",
  },

  // ── SEO ──
  seo: {
    defaultTitle: "Tienda Osvaldo — El pet shop aprobado por Osvaldo",
    titleTemplate: "%s — Tienda Osvaldo",
    defaultDescription: "Encontrá los mejores accesorios, alimentos y juguetes para perros y gatos. Aprobado por Osvaldo, disponible en Mercado Libre.",
    // [UX-FIX] Ruta para imagen OG dedicada (1200x630px) — reemplaza al logo que era demasiado pequeño para previews sociales
    // TODO: Crear /public/img/og-image.jpg con captura del hero del sitio (1200x630px)
    ogImage: "/img/og-image.jpg",
  },
} as const

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE MERCADO LIBRE
// ─────────────────────────────────────────────

export const mlConfig = {
  // ── CREDENCIALES (leer desde variables de entorno) ──
  appId: process.env.ML_APP_ID!,
  clientSecret: process.env.ML_CLIENT_SECRET!,
  refreshToken: process.env.ML_REFRESH_TOKEN!,
  affiliateId: process.env.ML_AFFILIATE_ID!,

  // ── API ──
  apiBaseUrl: "https://api.mercadolibre.com",
  siteId: "MLA", // Argentina

  // ── CATEGORÍAS DE MASCOTAS (IDs verificados via API) ──
  categories: {
    mascotas:     "MLA1071",   // Mascotas (raíz) — 1.8M productos
    perros:       "MLA1072",   // Perros — 935K productos
    gatos:        "MLA1081",   // Gatos — 370K productos
    alimentacion: "MLA434760", // Alimento, Premios y Suplemento (perros)
    juguetes:     "MLA1074",   // Juguetes (perros)
    paseo:        "MLA434764", // Viaje y Paseo (perros)
    camas:        "MLA11060",  // Camas y Cuchas (perros)
    higiene:      "MLA1076",   // Estética e Higiene (perros)
    accesorios:   "MLA1088",   // Accesorios (gatos)
    collares:     "MLA458036", // Collares
  },

  // ── PARÁMETROS DE BÚSQUEDA ──
  search: {
    defaultLimit: 20,          // Productos por página
    maxLimit: 48,
    defaultSort: "relevance",  // relevance | price_asc | price_desc | reviews_rating_average
    minRating: 3,              // Calificación mínima de vendedor
    condition: "new",          // new | used | all
  },

  // ── CACHÉ ──
  cache: {
    productsTTL: 3600,         // 1 hora en segundos
    categoryTTL: 3600,
    productDetailTTL: 1800,    // 30 minutos
  },

  // ── AFFILIATE LINK ──
  affiliateLinkBase: "https://www.mercadolibre.com.ar",

  // ── FILTROS DE REPUTACIÓN ──
  allowedSellerReputations: ["green", "light_green"],
} as const

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE GOOGLE ANALYTICS
// ─────────────────────────────────────────────

export const analyticsConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  enabled: process.env.NODE_ENV === "production",
} as const

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE ADSENSE
// ─────────────────────────────────────────────

export const adsenseConfig = {
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "",
  enabled: process.env.NODE_ENV === "production",
  slots: {
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
    inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || "",
    productBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PRODUCT_BOTTOM || "",
  },
} as const

// ─────────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────────

export const navConfig = {
  main: [
    { label: "Perros", href: "/categoria/perros" },
    { label: "Gatos", href: "/categoria/gatos" },
    { label: "Accesorios", href: "/categoria/accesorios" },
    { label: "Alimentación", href: "/categoria/alimentacion" },
  ],
  cta: {
    label: "Sobre Osvaldo 🐶",
    href: "/sobre-osvaldo",
  },
  footer: {
    categorias: [
      { label: "Perros", href: "/categoria/perros" },
      { label: "Gatos", href: "/categoria/gatos" },
      { label: "Accesorios", href: "/categoria/accesorios" },
      { label: "Alimentación", href: "/categoria/alimentacion" },
      { label: "Juguetes", href: "/categoria/juguetes" },
    ],
    tienda: [
      { label: "Sobre Osvaldo", href: "/sobre-osvaldo" },
      { label: "Cómo funciona", href: "/sobre-osvaldo#como-funciona" },
      { label: "Contacto", href: "/contacto" },
    ],
    legal: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Afiliados ML", href: "/afiliados" },
    ],
  },
} as const
