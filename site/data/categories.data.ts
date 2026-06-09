// Árbol de categorías de Mercado Libre (Mascotas — MLA1071)
// Datos estáticos — sin base de datos.
// Fuente: API pública de ML, fetcheado el 2026-06-05.
// Para actualizar: ejecutar el script de seed y copiar los datos aquí.

export interface CategoryData {
  mlId:       string
  name:       string
  slug:       string
  level:      number
  totalItems: number
  parentMlId: string | null
}

export const CATEGORIES_DATA: CategoryData[] = [
  // ── NIVEL 0 ─────────────────────────────────────────────────────────────────
  { mlId: "MLA1071",   name: "Mascotas",                      slug: "mascotas",                           level: 0, totalItems: 2123537, parentMlId: null       },

  // ── NIVEL 1 ─────────────────────────────────────────────────────────────────
  { mlId: "MLA1072",   name: "Perros",                        slug: "perros",                             level: 1, totalItems: 1059394, parentMlId: "MLA1071"  },
  { mlId: "MLA1081",   name: "Gatos",                         slug: "gatos",                              level: 1, totalItems:  410998, parentMlId: "MLA1071"  },
  { mlId: "MLA1091",   name: "Peces",                         slug: "peces",                              level: 1, totalItems:  233998, parentMlId: "MLA1071"  },
  { mlId: "MLA1100",   name: "Aves",                          slug: "aves",                               level: 1, totalItems:  176279, parentMlId: "MLA1071"  },
  { mlId: "MLA1105",   name: "Roedores",                      slug: "roedores",                           level: 1, totalItems:   73535, parentMlId: "MLA1071"  },
  { mlId: "MLA370459", name: "Correas para Mascotas",         slug: "correas-para-mascotas",              level: 1, totalItems:   64932, parentMlId: "MLA1071"  },
  { mlId: "MLA456660", name: "Jaulas para Mascotas",          slug: "jaulas-para-mascotas",               level: 1, totalItems:   16297, parentMlId: "MLA1071"  },
  { mlId: "MLA458036", name: "Collares",                      slug: "collares",                           level: 1, totalItems:   15616, parentMlId: "MLA1071"  },
  { mlId: "MLA1111",   name: "Reptiles y Anfibios",           slug: "reptiles-y-anfibios",                level: 1, totalItems:    4209, parentMlId: "MLA1071"  },
  { mlId: "MLA458045", name: "Contenedores de Alimento",      slug: "contenedores-de-alimento",           level: 1, totalItems:    2049, parentMlId: "MLA1071"  },
  { mlId: "MLA458038", name: "Golosinas para Mascotas",       slug: "golosinas-para-mascotas",            level: 1, totalItems:     765, parentMlId: "MLA1071"  },

  // ── NIVEL 2 — Perros ────────────────────────────────────────────────────────
  { mlId: "MLA7107",   name: "Indumentaria y Accesorios",     slug: "indumentaria-y-accesorios",          level: 2, totalItems:  196339, parentMlId: "MLA1072"  },
  { mlId: "MLA1074",   name: "Juguetes",                      slug: "juguetes",                           level: 2, totalItems:  178377, parentMlId: "MLA1072"  },
  { mlId: "MLA1076",   name: "Estética e Higiene",            slug: "estetica-e-higiene",                 level: 2, totalItems:  177207, parentMlId: "MLA1072"  },
  { mlId: "MLA434764", name: "Viaje y Paseo",                 slug: "viaje-y-paseo",                      level: 2, totalItems:  170840, parentMlId: "MLA1072"  },
  { mlId: "MLA434771", name: "Bebederos y Comederos",         slug: "bebederos-y-comederos",              level: 2, totalItems:   89508, parentMlId: "MLA1072"  },
  { mlId: "MLA11060",  name: "Camas y Cuchas",                slug: "camas-y-cuchas",                     level: 2, totalItems:   80672, parentMlId: "MLA1072"  },
  { mlId: "MLA32261",  name: "Adiestramiento",                slug: "adiestramiento",                     level: 2, totalItems:   56509, parentMlId: "MLA1072"  },
  { mlId: "MLA1073",   name: "Perros de Raza",                slug: "perros-de-raza",                     level: 2, totalItems:   35901, parentMlId: "MLA1072"  },
  { mlId: "MLA434760", name: "Alimento, Premios y Suplemento",slug: "alimento-premios-y-suplemento",      level: 2, totalItems:   32786, parentMlId: "MLA1072"  },
  { mlId: "MLA434762", name: "Puertas, Rampas y Corrales",    slug: "puertas-rampas-y-corrales",          level: 2, totalItems:   25647, parentMlId: "MLA1072"  },
  { mlId: "MLA429133", name: "Sillas de Ruedas",              slug: "sillas-de-ruedas",                   level: 2, totalItems:    3834, parentMlId: "MLA1072"  },

  // ── NIVEL 2 — Gatos ────────────────────────────────────────────────────────
  // Slugs con sufijo "-gatos" donde hay conflicto de nombre con subcategorías de Perros
  { mlId: "MLA1084",   name: "Juguetes",                      slug: "juguetes-gatos",                     level: 2, totalItems:  106039, parentMlId: "MLA1081"  },
  { mlId: "MLA1086",   name: "Estética e Higiene",            slug: "estetica-e-higiene-gatos",           level: 2, totalItems:   92287, parentMlId: "MLA1081"  },
  { mlId: "MLA81636",  name: "Comederos y Bebederos",         slug: "comederos-y-bebederos",              level: 2, totalItems:   59876, parentMlId: "MLA1081"  },
  { mlId: "MLA434788", name: "Camas y Cuchas",                slug: "camas-y-cuchas-gatos",               level: 2, totalItems:   56568, parentMlId: "MLA1081"  },
  { mlId: "MLA434784", name: "Viaje y Paseo",                 slug: "viaje-y-paseo-gatos",                level: 2, totalItems:   43404, parentMlId: "MLA1081"  },
  { mlId: "MLA434779", name: "Alimento, Premios y Suplemento",slug: "alimento-premios-y-suplemento-gatos",level: 2, totalItems:   18688, parentMlId: "MLA1081"  },
  { mlId: "MLA457249", name: "Pelotas",                       slug: "pelotas",                            level: 2, totalItems:    9420, parentMlId: "MLA1081"  },
  { mlId: "MLA457539", name: "Indumentaria y Accesorios",     slug: "indumentaria-y-accesorios-gatos",    level: 2, totalItems:    8696, parentMlId: "MLA1081"  },
  { mlId: "MLA434781", name: "Puertas y Rampas",              slug: "puertas-y-rampas",                   level: 2, totalItems:    4593, parentMlId: "MLA1081"  },
  { mlId: "MLA1088",   name: "Accesorios",                    slug: "accesorios-gatos",                   level: 2, totalItems:    3784, parentMlId: "MLA1081"  },
  { mlId: "MLA457875", name: "Kits de Juguetes",              slug: "kits-de-juguetes",                   level: 2, totalItems:    1679, parentMlId: "MLA1081"  },
  { mlId: "MLA457276", name: "Bozales",                       slug: "bozales",                            level: 2, totalItems:    1816, parentMlId: "MLA1081"  },
]
