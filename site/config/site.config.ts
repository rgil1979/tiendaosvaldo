// ─────────────────────────────────────────────
// CONFIGURACIÓN CENTRAL — TIENDA OSVALDO
// Todos los valores configurables del sitio
// ─────────────────────────────────────────────

export const siteConfig = {
  // ── INFORMACIÓN DEL SITIO ──
  name: "Tienda Osvaldo",
  description: "Osvaldo te ayuda a elegir productos para perros y gatos: guías claras y una selección de productos para comprar en Mercado Libre.",
  url: "https://tiendaosvaldo.com.ar",
  logo: "/img/logo.jpeg",
  favicon: "/img/favicon.ico",
  locale: "es-AR",

  // ── OSVALDO ──
  osvaldo: {
    raza: "Mestizo adoptado",
    edad: "8 años",
    descripcionCorta: "Perro mestizo adoptado, 8 años, y fundador involuntario de esta tienda. No pruebo todos los productos: te ayudo a elegir. Lo que uso de verdad, te lo cuento.",
    bio: [
      // Solo hechos: Osvaldo no prueba los productos del sitio (S1-08, términos del programa de afiliados).
      "Osvaldo llegó a casa hace 8 años y es la cara de esta tienda. No prueba todos los productos que aparecen acá: el sitio te ayuda a elegir con guías.",
      "Lo que sí usa de verdad: su pretal Trixie, sus juguetes y los snacks de pollo deshidratado. De eso habla con conocimiento de causa.",
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
    defaultTitle: "Tienda Osvaldo — Osvaldo te ayuda a elegir para tu perro o gato",
    titleTemplate: "%s — Tienda Osvaldo",
    defaultDescription: "Guías y productos seleccionados para perros y gatos: pretales, alimento, arena, camas y juguetes. Osvaldo te ayuda a elegir; comprás en Mercado Libre.",
    ogImage: "/img/og-image.jpg",
  },
} as const

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE MERCADO LIBRE
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// MAPA DE SLUGS DE CATEGORÍA → DOMINIO + QUERY
// Usado en /categoria/[slug]
// ─────────────────────────────────────────────

export const SLUG_CONFIG: Record<string, {
  label:         string
  emoji:         string
  domainId:      string
  query:         string   // siempre requerido — filtra correctamente por tipo de mascota
  hlCategoryId?: string   // solo categorías donde highlights son homogéneos (sin mezcla)
  mascota?:      "perro" | "gato"
}> = {
  // domainId + query garantizan resultados filtrados (domain solo da 0 sin q)
  "alimento-perro": { label: "Alimento para perros", emoji: "🍖", domainId: "MLA-CAT_AND_DOG_FOODS", query: "perro",               hlCategoryId: "MLA434760", mascota: "perro" },
  "alimento-gato":  { label: "Alimento para gatos",  emoji: "🐟", domainId: "MLA-CAT_AND_DOG_FOODS", query: "gato",                hlCategoryId: "MLA1081",   mascota: "gato"  },
  "collares":       { label: "Collares, correas y arneses", emoji: "🦮", domainId: "MLA-PET_COLLARS",        query: "collar"                                       },
  "camas":          { label: "Camas y cuchas",        emoji: "🛏️", domainId: "MLA-CAT_AND_DOG_BEDS",   query: "cama",               hlCategoryId: "MLA11060"  },
  "arena-gato":     { label: "Arena para gatos",     emoji: "🧂", domainId: "MLA-CATS_LITTER",        query: "arena gato",                                    mascota: "gato"  },
  "mascotas":       { label: "Mascotas",              emoji: "🐾", domainId: "",                       query: "mascota",            hlCategoryId: "MLA1071"   },
  // perros/gatos: sin domainId → multi-dominio → muestra alimentos, camas, collares, etc. filtrados por especie
  "perros":         { label: "Perros",                emoji: "🐕", domainId: "",                       query: "perro",                                          mascota: "perro" },
  "gatos":          { label: "Gatos",                 emoji: "🐈", domainId: "",                       query: "gato",                                           mascota: "gato"  },
  "accesorios":     { label: "Accesorios",            emoji: "🎒", domainId: "",                       query: "accesorio mascota"                                      },
  "alimentacion":   { label: "Alimentación",          emoji: "🍖", domainId: "MLA-CAT_AND_DOG_FOODS",  query: "alimento",           hlCategoryId: "MLA434760" },
  "juguetes":       { label: "Juguetes",              emoji: "🧸", domainId: "",                       query: "juguete mascota",    hlCategoryId: "MLA1074"   },
}

// ─────────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────────

export const navConfig = {
  main: [
    { label: "Perros", href: "/categoria/perros" },
    { label: "Gatos", href: "/categoria/gatos" },
    { label: "Accesorios", href: "/categoria/accesorios" },
    { label: "Juguetes", href: "/categoria/juguetes" },
    { label: "Alimentación", href: "/categoria/alimentacion" },
    { label: "Guías", href: "/guias" },
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
      { label: "Guías", href: "/guias" },
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

export const ogBase = {
  siteName: siteConfig.name,
  images:   [{ url: '/img/og-image.jpg', width: 1200, height: 630 }],
}
