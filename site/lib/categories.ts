import { dbConnect } from './db'
import { Category } from '../models/Category'

export interface CategoryNode {
  mlId:       string
  name:       string
  slug:       string
  level:      number
  totalItems: number
  parentMlId: string | null
}

// Nivel 1: Perros, Gatos, etc. — hijos directos de Mascotas
export async function getNavCategories(): Promise<CategoryNode[]> {
  await dbConnect()
  const cats = await Category
    .find({ level: 1, active: true })
    .sort({ totalItems: -1 })
    .lean()
  return cats.map(toNode)
}

// Nivel 0: raíz (Mascotas)
export async function getRootCategory(): Promise<CategoryNode | null> {
  await dbConnect()
  const cat = await Category.findOne({ level: 0, active: true }).lean()
  return cat ? toNode(cat) : null
}

// Subcategorías de una categoría padre
export async function getSubcategories(parentMlId: string): Promise<CategoryNode[]> {
  await dbConnect()
  const cats = await Category
    .find({ parentMlId, active: true })
    .sort({ totalItems: -1 })
    .lean()
  return cats.map(toNode)
}

// Buscar por slug (para páginas dinámicas)
export async function getCategoryBySlug(slug: string): Promise<CategoryNode | null> {
  await dbConnect()
  const cat = await Category.findOne({ slug, active: true }).lean()
  return cat ? toNode(cat) : null
}

// Buscar por ID de ML
export async function getCategoryByMlId(mlId: string): Promise<CategoryNode | null> {
  await dbConnect()
  const cat = await Category.findOne({ mlId, active: true }).lean()
  return cat ? toNode(cat) : null
}

// Categorías irrelevantes para un pet shop — se excluyen del árbol lateral
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
])

// Todos los niveles 1 y 2 para el árbol lateral
export async function getAllCategoriesForTree(): Promise<CategoryNode[]> {
  await dbConnect()
  const cats = await Category
    .find({ active: true, level: { $in: [1, 2] } })
    .sort({ level: 1, totalItems: -1 })
    .lean()
  return cats
    .map(toNode)
    .filter((c) => !EXCLUDED_CATEGORY_NAMES.has(c.name.toLowerCase().trim()))
}

// Breadcrumb: devuelve los ancestros en orden raíz → nodo
export async function getCategoryBreadcrumb(mlId: string): Promise<CategoryNode[]> {
  await dbConnect()
  const cat = await Category.findOne({ mlId }).lean()
  if (!cat) return []
  const ancestors = await Category
    .find({ mlId: { $in: cat.path } })
    .lean()
  const byId = new Map(ancestors.map((a) => [a.mlId, toNode(a)]))
  return cat.path.map((id) => byId.get(id)).filter(Boolean) as CategoryNode[]
}

function toNode(cat: {
  mlId:       string
  name:       string
  slug:       string
  level:      number
  totalItems: number
  parentMlId: string | null
}): CategoryNode {
  return {
    mlId:       cat.mlId,
    name:       cat.name,
    slug:       cat.slug,
    level:      cat.level,
    totalItems: cat.totalItems,
    parentMlId: cat.parentMlId,
  }
}
