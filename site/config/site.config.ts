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
    ogImage: "/img/logo.jpeg",
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
}> = {
  // domainId + query garantizan resultados filtrados (domain solo da 0 sin q)
  "alimento-perro": { label: "Alimento para perros", emoji: "🍖", domainId: "MLA-CAT_AND_DOG_FOODS", query: "perro",               hlCategoryId: "MLA434760" },
  "alimento-gato":  { label: "Alimento para gatos",  emoji: "🐟", domainId: "MLA-CAT_AND_DOG_FOODS", query: "gato",                hlCategoryId: "MLA1081"   },
  "collares":       { label: "Collares y correas",   emoji: "🦮", domainId: "MLA-PET_COLLARS",        query: "collar"                                       },
  "camas":          { label: "Camas y cuchas",        emoji: "🛏️", domainId: "MLA-CAT_AND_DOG_BEDS",   query: "cama",               hlCategoryId: "MLA11060"  },
  "arena-gato":     { label: "Arena para gatos",     emoji: "🧂", domainId: "MLA-CATS_LITTER",        query: "arena gato",                                    },
  "mascotas":       { label: "Mascotas",              emoji: "🐾", domainId: "",                       query: "mascota",            hlCategoryId: "MLA1071"   },
  // perros/gatos: sin domainId → multi-dominio → muestra alimentos, camas, collares, etc. filtrados por especie
  "perros":         { label: "Perros",                emoji: "🐕", domainId: "",                       query: "perro"                                          },
  "gatos":          { label: "Gatos",                 emoji: "🐈", domainId: "",                       query: "gato"                                           },
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
