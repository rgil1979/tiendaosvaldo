export type ProductoCurado = {
  id: string
  titulo: string
  imagen: string
  categoria: string
  linkAfiliado: string
  mascota: "perro" | "gato"
}

// Categorías válidas para usar en SLUG_CONFIG y rutas de categoría
export const CATEGORIA_SLUGS: Record<string, string> = {
  "Collares / Arneses Perros": "collares",
  "Collares / Arneses Gatos":  "collares",
  "Camas Perros":              "camas",
  "Camas Gatos":               "camas",
  "Juguetes Perros":           "juguetes",
  "Juguetes Gatos":            "juguetes",
  "Accesorios Perros":         "accesorios",
  "Accesorios Gatos":          "accesorios",
}

export const productosCurados: ProductoCurado[] = [
  // ─── Collares / Arneses Perros ───────────────────────────────────────────
  {
    id: "col-p-001",
    titulo: "Arnes K9 Pretal Anti Tirones + Correa 3m + Collar K9 Perro",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_644396-MLA88781852488_082025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/13WNuhc",
    mascota: "perro",
  },
  {
    id: "col-p-002",
    titulo: "Pretal Arnés Para Perro Antiescape Antitirones Regulable",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_914059-MLA108551288285_032026-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/1agRGhj",
    mascota: "perro",
  },
  {
    id: "col-p-003",
    titulo: "Arnes Pechera Pitbull Razas Fuertes Reforzado Ajustable",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_960919-MLA102680184743_122025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/2kgsUeS",
    mascota: "perro",
  },
  {
    id: "col-p-004",
    titulo: "Collar Arnes Pretal Perro Y Gato Con Correa Anti Tirones",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_742310-MLA100875190483_122025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/13aESqG",
    mascota: "perro",
  },
  {
    id: "col-p-005",
    titulo: "Pechera Arnés Reforzada Con Correa Para Perro Mediano",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_878044-MLA103584050766_012026-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/2bqJhCN",
    mascota: "perro",
  },
  {
    id: "col-p-006",
    titulo: "Pretal Arnés Para Perros Y Gatos Reforzado Doble Costura Color Camuflado Rosa",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_756565-MLA110240668664_052026-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/2J23bWp",
    mascota: "perro",
  },
  {
    id: "col-p-007",
    titulo: "Arnés H Paseo Viajes Anti-tirón Regulable Doble Enganche",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_783874-MLA89166268127_082025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/15bvtLs",
    mascota: "perro",
  },

  // ─── Collares / Arneses Gatos ────────────────────────────────────────────
  {
    id: "col-g-001",
    titulo: "Arnés Falda H Collar Gato Perro Con Correa Y Moño",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_612295-CBT89096379539_082025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/1ZBpESg",
    mascota: "gato",
  },
  {
    id: "col-g-002",
    titulo: "Arnés Y Correa Para Gatos A Prueba De Escape, Paquete De 2",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_860355-CBT111033262654_052026-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/23HXf2g",
    mascota: "gato",
  },
  {
    id: "col-g-003",
    titulo: "Arnés Y Correa Para Gatos, Ajustable Anti-escape",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_630118-CBT93784316798_102025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/2P5VuPs",
    mascota: "gato",
  },
  {
    id: "col-g-004",
    titulo: "Collar Para Gatos Rastreable para Airtag y Mototag Regulable Reflectivo",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828605-MLA100111327515_122025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/1BTZxb6",
    mascota: "gato",
  },
  {
    id: "col-g-005",
    titulo: "Pechera Arnés Transpirable Cómodo Con Correa Para Perro Gato",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_956157-MLM96083638050_102025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/1XpptKF",
    mascota: "gato",
  },
  {
    id: "col-g-006",
    titulo: "Arnés Para Gato Con GPS Bolsillo Naranja Antiescape",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_952385-MLA102099861349_122025-F.webp",
    categoria: "collares",
    linkAfiliado: "https://meli.la/1Hk8nfm",
    mascota: "gato",
  },

  // ─── Camas Perros ────────────────────────────────────────────────────────
  {
    id: "cam-p-001",
    titulo: "Moises Para Perro Alaska Grande",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_730148-MLA112248777189_052026-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/2wGeNon",
    mascota: "perro",
  },
  {
    id: "cam-p-002",
    titulo: "Cama Para Perro Grande Colchoneta Antidesgarro",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_736352-MLA93388722933_092025-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/2g5hMaP",
    mascota: "perro",
  },
  {
    id: "cam-p-003",
    titulo: "Cama Moisés Nido Nórdico Antiestrés Funda 60cm Perro Gato",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_671055-MLA110413745174_052026-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/22ZDBTY",
    mascota: "perro",
  },
  {
    id: "cam-p-004",
    titulo: "Cama Para Perro Y Gato Anti Desgarro Y Antideslizante",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_685480-MLA89883965418_082025-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/2JEz7Vb",
    mascota: "perro",
  },

  // ─── Camas Gatos ─────────────────────────────────────────────────────────
  {
    id: "cam-g-001",
    titulo: "2x Saco Cama Mascotas Cueva Polar Soft Abrigado 45x55",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_807224-MLA111360722788_052026-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/1kX5n3g",
    mascota: "gato",
  },
  {
    id: "cam-g-002",
    titulo: "Cama Bolsa Dormir Mascotas 4 En 1 Corderito Reversible 70x50",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_914323-MLA109566255224_042026-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/2R32PMM",
    mascota: "gato",
  },
  {
    id: "cam-g-003",
    titulo: "Cama Cueva Bolsa De Dormir Gatos Perros Reversible Calurosa",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_996293-MLA112754787711_062026-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/1BynzqJ",
    mascota: "gato",
  },
  {
    id: "cam-g-004",
    titulo: "Casita Cama Cucha Iglú Para Mascotas Pequeñas Medianas",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_750954-MLA95950709679_102025-F.webp",
    categoria: "camas",
    linkAfiliado: "https://meli.la/1VCMUFi",
    mascota: "gato",
  },

  // ─── Juguetes Perros ─────────────────────────────────────────────────────
  {
    id: "jug-p-001",
    titulo: "Juguete Para Perro Premium Gigwi Suppa Puppa Dino Squeaker",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_692801-MLA50175920355_062022-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/1oVEeDr",
    mascota: "perro",
  },
  {
    id: "jug-p-002",
    titulo: "Alfombra Olfativa Perros Gatos Juguete Interactivo 75x50cm",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_791713-MLA90030482913_082025-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/1yh6RpL",
    mascota: "perro",
  },
  {
    id: "jug-p-003",
    titulo: "Juguete Para Perros Peluche Con Chifle Sonido Mordible",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828574-MLA82248726103_022025-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/1FSg9Do",
    mascota: "perro",
  },

  // ─── Juguetes Gatos ──────────────────────────────────────────────────────
  {
    id: "jug-g-001",
    titulo: "Juguete Para Gato Pelota Interactiva Con Cuerda Antiansiedad",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_631744-MLA90029189521_082025-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/1vgncGZ",
    mascota: "gato",
  },
  {
    id: "jug-g-002",
    titulo: "Juguete Interactivo Para Gatos Cañita Giratoria Funloop",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_921921-MLA112692218233_062026-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/2QhuUhg",
    mascota: "gato",
  },
  {
    id: "jug-g-003",
    titulo: "Juguete Interactivo Varita Retráctil Laser Automático Para Gato",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_680983-MLA99977022166_122025-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/2gFiuXJ",
    mascota: "gato",
  },
  {
    id: "jug-g-004",
    titulo: "Juguete Interactivo Rascador De Cartón Para Gato Con Bola",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_801102-CBT109511775395_032026-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/2pvreau",
    mascota: "gato",
  },
  {
    id: "jug-g-005",
    titulo: "Rueda Correr Ejercicio Para Gatos",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_956386-MLA95404934186_102025-F.webp",
    categoria: "juguetes",
    linkAfiliado: "https://meli.la/2MhyFSC",
    mascota: "gato",
  },

  // ─── Accesorios Perros ───────────────────────────────────────────────────
  {
    id: "acc-p-001",
    titulo: "Rampa Para Perros Plegable Doble Refuerzo Antideslizante",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_885957-MLA81514858552_012025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/29XMXx8",
    mascota: "perro",
  },
  {
    id: "acc-p-002",
    titulo: "Colchon Impermeable Con Funda Lyon Pet 70x50 Razas Chicas",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_855355-MLA89715431857_082025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/27WL4WN",
    mascota: "perro",
  },
  {
    id: "acc-p-003",
    titulo: "Toallitas Húmedas Para Perros Y Gatos X80 Sin Alcohol",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_634090-MLA107525754920_032026-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/2ZesuP6",
    mascota: "perro",
  },
  {
    id: "acc-p-004",
    titulo: "Cucha Cama Casa Para Perro Razas Pequeñas Lavable Rimax",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_730499-MLA106671354697_022026-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/1yMXJrQ",
    mascota: "perro",
  },

  // ─── Accesorios Gatos ────────────────────────────────────────────────────
  {
    id: "acc-g-001",
    titulo: "Gimnasio Rascador Para Gatos Con Juguete Felpa Sisal",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828408-MLA95666849680_102025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/2JjbRiW",
    mascota: "gato",
  },
  {
    id: "acc-g-002",
    titulo: "Caja Sanitaria Inox Doble Cerrada Con Pala 60×40cm Antiderrame",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_996832-MLA106728599958_022026-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/2RBy6Kh",
    mascota: "gato",
  },
  {
    id: "acc-g-003",
    titulo: "Rascador Super Torre Premium Gimnasio Para Gatos",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_672322-MLA83412146408_042025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/226F8Nh",
    mascota: "gato",
  },
  {
    id: "acc-g-004",
    titulo: "Litera Catit Jumbo Para Gatos Baño Cerrado Filtro Anti Olor",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_671938-MLA99983156053_112025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/1mtuv9c",
    mascota: "gato",
  },
  {
    id: "acc-g-005",
    titulo: "Bandeja Litera Mueble Sanitario Para Gatos Grande",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_946145-MLA93070326500_092025-F.webp",
    categoria: "accesorios",
    linkAfiliado: "https://meli.la/151nJHA",
    mascota: "gato",
  },
]

// Helper: obtener productos por slug de categoría
export function getProductosByCategoria(slug: string): ProductoCurado[] {
  return productosCurados.filter((p) => p.categoria === slug)
}

// Helper: obtener un producto por id
export function getProductoById(id: string): ProductoCurado | undefined {
  return productosCurados.find((p) => p.id === id)
}
