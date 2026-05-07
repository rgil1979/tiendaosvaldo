/**
 * SEED — Categorías de Mercado Libre (Mascotas)
 *
 * Pobla MongoDB con la jerarquía de la categoría Mascotas de MLA.
 * Usa la API pública de ML (no requiere token).
 *
 * Uso:
 *   npm run seed                        # seed completo
 *   npm run seed -- --force             # re-seed aunque ya existan datos
 *   MASCOTAS_ML_ID=MLA1743 npm run seed # ID personalizado
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import { Category } from '../models/Category'

// Cargar .env desde la raíz del repositorio (un nivel arriba de /site)
dotenv.config({ path: resolve(process.cwd(), '..', '.env') })
dotenv.config() // fallback: .env local en /site si existe

// ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────

const MONGODB_URI    = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/tiendaosvaldo'
const MASCOTAS_ML_ID = process.env.MASCOTAS_ML_ID ?? 'MLA1071'
const MAX_LEVEL      = 2   // 0=Mascotas, 1=Perros/Gatos/etc., 2=subcategorías
const FORCE          = process.argv.includes('--force')

// ── TIPOS ML ──────────────────────────────────────────────────────────────────

interface MLCategoryChild {
  id:                            string
  name:                          string
  total_items_in_this_category:  number
}

interface MLCategory {
  id:                            string
  name:                          string
  total_items_in_this_category:  number
  path_from_root:                { id: string; name: string }[]
  children_categories:           MLCategoryChild[]
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function fetchMLCategory(id: string): Promise<MLCategory> {
  const res = await fetch(`https://api.mercadolibre.com/categories/${id}`)
  if (!res.ok) {
    throw new Error(`ML API ${res.status} al obtener categoría ${id}`)
  }
  return res.json() as Promise<MLCategory>
}

// ── SEED RECURSIVO ────────────────────────────────────────────────────────────

async function seedCategory(
  id:          string,
  level:       number,
  parentMlId:  string | null,
  path:        string[],
): Promise<number> {
  const data        = await fetchMLCategory(id)
  const currentPath = [...path, id]

  await Category.findOneAndUpdate(
    { mlId: id },
    {
      mlId:        id,
      name:        data.name,
      slug:        slugify(data.name),
      parentMlId,
      level,
      path:        currentPath,
      childrenIds: data.children_categories.map((c) => c.id),
      totalItems:  data.total_items_in_this_category,
      active:      true,
    },
    { upsert: true, new: true, runValidators: true }
  )

  const indent = '  '.repeat(level)
  const childCount = data.children_categories.length
  console.log(
    `${indent}[nivel ${level}] ${data.name} ` +
    `(${data.total_items_in_this_category.toLocaleString('es-AR')} items` +
    `${childCount ? `, ${childCount} hijos` : ''})`
  )

  if (level >= MAX_LEVEL || childCount === 0) return 1

  let count = 1
  for (const child of data.children_categories) {
    count += await seedCategory(child.id, level + 1, id, currentPath)
  }
  return count
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('━'.repeat(60))
  console.log('SEED — Categorías Mercado Libre (Mascotas)')
  console.log('━'.repeat(60))

  console.log(`\nConectando a MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//<credenciales>@')}\n`)
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  console.log('Conectado.\n')

  // Verificar si ya hay datos
  if (!FORCE) {
    const existing = await Category.countDocuments()
    if (existing > 0) {
      console.log(`Ya existen ${existing} categorías en la BD.`)
      console.log('Usá --force para re-seedear y sobreescribir.\n')
      await mongoose.disconnect()
      return
    }
  }

  console.log(`Categoría raíz ML: ${MASCOTAS_ML_ID}`)
  console.log(`Niveles máximos:   ${MAX_LEVEL + 1} (0–${MAX_LEVEL})`)
  if (FORCE) console.log('Modo: --force (sobreescribiendo datos existentes)')
  console.log()

  const total = await seedCategory(MASCOTAS_ML_ID, 0, null, [])

  console.log()
  console.log('━'.repeat(60))
  console.log(`Seed completado: ${total} categorías guardadas en MongoDB`)
  console.log('━'.repeat(60))

  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('\nError en seed:', (err as Error).message)
  process.exit(1)
})
