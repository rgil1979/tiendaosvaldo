// Buscador del sitio (S1-12): busca dentro del catálogo curado, sin la API de Mercado Libre.
// Antes /buscar usaba la búsqueda de ML (/sites/MLA/search), que da 403: nunca devolvía nada.
//
// Cómo busca: pasa todo a minúsculas y sin tildes, saca palabras vacías ("para", "de"…) y
// exige que cada palabra de la consulta aparezca en el título, la categoría o la mascota del
// producto. Acepta plurales ("pretales" encuentra "pretal") y algunos sinónimos de uso común.

import { SLUG_CONFIG } from "@/config/site.config"
import { productosCurados, type ProductoCurado } from "@/data/productos-curados"
import type { MLProductFull } from "@/lib/mercadolibre"

const PALABRAS_VACIAS = new Set([
  "a", "al", "con", "de", "del", "el", "en", "la", "las", "lo", "los", "mi", "mis",
  "o", "para", "por", "su", "sus", "un", "una", "unas", "unos", "y",
])

// Sinónimos de uso común en Argentina (claves y valores ya normalizados).
const SINONIMOS: Record<string, string[]> = {
  arnes:      ["pretal", "pechera"],
  balanceado: ["alimento"],
  comida:     ["alimento"],
  croqueta:   ["alimento"],
  cucha:      ["cama"],
  gatito:     ["gato", "kitten"],
  pechera:    ["arnes", "pretal"],
  perrito:    ["perro"],
  piedra:     ["arena"],
  piedrita:   ["arena"],
  pretal:     ["arnes", "pechera"],
}

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

// "pretales" → ["pretales", "pretal", "pretale"]: alcanza con que alguna coincida.
function variantes(termino: string): string[] {
  const v = [termino]
  if (termino.length > 4 && termino.endsWith("es")) v.push(termino.slice(0, -2))
  if (termino.length > 3 && termino.endsWith("s")) v.push(termino.slice(0, -1))
  return v
}

// Una palabra coincide si alguna palabra del texto empieza con ella. "unido" es el título sin
// espacios, para que "antitirones" encuentre "Anti Tirones".
function coincide(palabras: string[], unido: string, termino: string): boolean {
  return variantes(termino).some(
    (v) => palabras.some((w) => w.startsWith(v)) || (v.length >= 4 && unido.includes(v))
  )
}

const INDICE = productosCurados.map((producto, orden) => {
  const titulo    = normalizar(producto.titulo)
  const categoria = normalizar(`${SLUG_CONFIG[producto.categoria]?.label ?? ""} ${producto.categoria}`)
  return {
    producto,
    orden,
    palabrasTitulo: titulo.split(" "),
    palabrasResto:  `${categoria} ${producto.mascota}`.split(" ").filter(Boolean),
    unido:          titulo.replace(/ /g, ""),
  }
})

export function buscarCurados(consulta: string): ProductoCurado[] {
  const terminos = normalizar(consulta)
    .split(" ")
    .filter((t) => t && !PALABRAS_VACIAS.has(t))
  if (terminos.length === 0) return []

  const resultados: { producto: ProductoCurado; puntaje: number; orden: number }[] = []

  for (const item of INDICE) {
    let puntaje = 0
    let todos   = true
    for (const termino of terminos) {
      const opciones = Array.from(new Set([
        termino,
        ...variantes(termino).flatMap((v) => SINONIMOS[v] ?? []),
      ]))
      const enTitulo = opciones.some((o) => coincide(item.palabrasTitulo, item.unido, o))
      const enResto  = opciones.some((o) => coincide(item.palabrasResto, "", o))
      if (!enTitulo && !enResto) { todos = false; break }
      // El título pesa más; si coincide en los dos, suma los dos.
      puntaje += (enTitulo ? 2 : 0) + (enResto ? 1 : 0)
    }
    if (todos) resultados.push({ producto: item.producto, puntaje, orden: item.orden })
  }

  return resultados
    .sort((a, b) => b.puntaje - a.puntaje || a.orden - b.orden)
    .map((r) => r.producto)
}

// Arma el objeto que espera ProductCard, igual que las categorías y las guías.
export function curadoATarjeta(p: ProductoCurado): MLProductFull {
  return {
    id:                  p.id,
    name:                p.titulo,
    pictures:            [{ id: "0", url: p.imagen }],
    affiliateUrl:        p.linkAfiliado,
    price:               0,
    condition:           "new",
    free_shipping:       false,
    accepts_mercadopago: false,
    currency_id:         "ARS",
    short_description:   "",
    main_features:       [],
    attributes:          [],
    domain_id:           "",
    status:              "active",
    item_id:             p.id,
    warranty:            null,
  }
}
