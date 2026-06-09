import { CATEGORIES_DATA } from '@/data/categories.data'

export interface CategoryNode {
  mlId:       string
  name:       string
  slug:       string
  level:      number
  totalItems: number
  parentMlId: string | null
}

const EXCLUDED_CATEGORY_NAMES = new Set([
  "autos y camiones nuevos",
  "autos y camiones",
  "jabones",
  "insectos",
  "cortauñas",
  "cortaúñas",
  "autos y camionetas nuevos",
  "autos y camionetas",
  "motos",
  "colectivos",
  "ahuyentadores ultrasónicos",
  "ahuyentadores ultrasonicos",
  "moños",
  "planes de ahorro",
  "botas y zapatos",
  "autos chocados y averiados",
  "semirremolque",
  "semirremolques",
  "semiremolques",
  "semiremolque",
  "otros",
  "pastas dentales",
  "maquinaria agrícola",
  "maquinaria agricola",
  "motorhome",
  "motorhomes",
  "autos de colección",
  "autos de coleccion",
  "cinturones de seguridad",
  "pilotos",
  "maquinaria vial",
  "pañales",
  "camiones",
  "otros vehículos",
  "otros vehiculos",
  "abrigos",
  "caballos",
  "náutica",
  "nautica",
  "cepillos y peines",
  "conejos",
])

function isActive(c: CategoryNode): boolean {
  return !EXCLUDED_CATEGORY_NAMES.has(c.name.toLowerCase().trim())
}

// Nivel 1: Perros, Gatos, etc. — hijos directos de Mascotas
export async function getNavCategories(): Promise<CategoryNode[]> {
  return CATEGORIES_DATA
    .filter((c) => c.level === 1 && isActive(c))
    .sort((a, b) => b.totalItems - a.totalItems)
}

// Nivel 0: raíz (Mascotas)
export async function getRootCategory(): Promise<CategoryNode | null> {
  return CATEGORIES_DATA.find((c) => c.level === 0) ?? null
}

// Subcategorías de una categoría padre
export async function getSubcategories(parentMlId: string): Promise<CategoryNode[]> {
  return CATEGORIES_DATA
    .filter((c) => c.parentMlId === parentMlId && isActive(c))
    .sort((a, b) => b.totalItems - a.totalItems)
}

// Buscar por slug (para páginas dinámicas)
export async function getCategoryBySlug(slug: string): Promise<CategoryNode | null> {
  return CATEGORIES_DATA.find((c) => c.slug === slug && isActive(c)) ?? null
}

// Buscar por ID de ML
export async function getCategoryByMlId(mlId: string): Promise<CategoryNode | null> {
  return CATEGORIES_DATA.find((c) => c.mlId === mlId && isActive(c)) ?? null
}

// Todos los niveles 1 y 2 para el árbol lateral
export async function getAllCategoriesForTree(): Promise<CategoryNode[]> {
  return CATEGORIES_DATA
    .filter((c) => (c.level === 1 || c.level === 2) && isActive(c))
    .sort((a, b) => a.level - b.level || b.totalItems - a.totalItems)
}

// Breadcrumb: devuelve los ancestros en orden raíz → nodo
export async function getCategoryBreadcrumb(mlId: string): Promise<CategoryNode[]> {
  const cat = CATEGORIES_DATA.find((c) => c.mlId === mlId)
  if (!cat) return []

  const result: CategoryNode[] = []
  let current: CategoryNode | undefined = cat
  while (current !== undefined) {
    result.unshift(current)
    const parentId: string | null = current.parentMlId
    current = parentId ? CATEGORIES_DATA.find((c) => c.mlId === parentId) : undefined
  }
  return result
}
