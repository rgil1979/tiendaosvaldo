// ─────────────────────────────────────────────────────
// PRODUCTOS CURADOS — TIENDA OSVALDO
//
// Estos productos se muestran cuando la API de Mercado Libre
// no está disponible. Reemplazá los datos con productos reales:
//
// 1. Buscá el producto en mercadolibre.com.ar
// 2. Copiá: título, precio, imagen (clic derecho → copiar imagen URL),
//    y el link del producto
// 3. Pegalo en el array de la categoría correspondiente
//
// El campo `permalink` debe ser el link real de ML — el sistema
// le agrega automáticamente tu ID de afiliado al redirigir.
// ─────────────────────────────────────────────────────

import type { MLProduct } from "@/lib/mercadolibre"

// Imagen placeholder mientras no hay datos reales
const PH = (texto: string) =>
  `https://placehold.co/400x400/f0dec8/3d1f0d?text=${encodeURIComponent(texto)}`

type CuratedMap = Record<string, MLProduct[]>

export const curatedProducts: CuratedMap = {
  // ── MASCOTAS (home y fallback general) ─────────────────
  MLA1071: [
    {
      id: "curated-1",
      title: "Collar ajustable para perro con hebilla de seguridad",
      price: 4500,
      original_price: 6000,
      currency_id: "ARS",
      available_quantity: 10,
      condition: "new",
      thumbnail: PH("Collar"),
      permalink: "https://listado.mercadolibre.com.ar/perros/collares/_CatId_MLA1072",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA1072",
    },
    {
      id: "curated-2",
      title: "Arnés antipull para perros medianos y grandes",
      price: 7200,
      original_price: null,
      currency_id: "ARS",
      available_quantity: 5,
      condition: "new",
      thumbnail: PH("Arnés"),
      permalink: "https://listado.mercadolibre.com.ar/perros/arneses/_CatId_MLA1072",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA1072",
    },
    {
      id: "curated-3",
      title: "Rascador con cuchas para gato 130 cm - Torre sisal",
      price: 18500,
      original_price: 24000,
      currency_id: "ARS",
      available_quantity: 3,
      condition: "new",
      thumbnail: PH("Rascador"),
      permalink: "https://listado.mercadolibre.com.ar/gatos/rascadores/_CatId_MLA1081",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA1081",
    },
    {
      id: "curated-4",
      title: "Cama para perro lavable antideslizante talla M",
      price: 9800,
      original_price: null,
      currency_id: "ARS",
      available_quantity: 8,
      condition: "new",
      thumbnail: PH("Cama"),
      permalink: "https://listado.mercadolibre.com.ar/perros/camas-ropa/_CatId_MLA1072",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: false },
      category_id: "MLA11060",
    },
    {
      id: "curated-5",
      title: "Alimento seco para perro adulto razas medianas 15 kg",
      price: 32000,
      original_price: 38000,
      currency_id: "ARS",
      available_quantity: 20,
      condition: "new",
      thumbnail: PH("Alimento"),
      permalink: "https://listado.mercadolibre.com.ar/perros/alimentos/_CatId_MLA1072",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA434760",
    },
    {
      id: "curated-6",
      title: "Juguete mordedor para perro de goma resistente",
      price: 3200,
      original_price: null,
      currency_id: "ARS",
      available_quantity: 15,
      condition: "new",
      thumbnail: PH("Juguete"),
      permalink: "https://listado.mercadolibre.com.ar/perros/juguetes/_CatId_MLA1072",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: false },
      category_id: "MLA1074",
    },
    {
      id: "curated-7",
      title: "Arena sanitaria para gatos aglomerante x 10 kg",
      price: 8500,
      original_price: 10000,
      currency_id: "ARS",
      available_quantity: 30,
      condition: "new",
      thumbnail: PH("Arena"),
      permalink: "https://listado.mercadolibre.com.ar/gatos/arena-sanitaria/_CatId_MLA1081",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA1081",
    },
    {
      id: "curated-8",
      title: "Transportin rígido para mascotas hasta 6 kg",
      price: 14500,
      original_price: 18000,
      currency_id: "ARS",
      available_quantity: 7,
      condition: "new",
      thumbnail: PH("Transportin"),
      permalink: "https://listado.mercadolibre.com.ar/mascotas/transportines/_CatId_MLA1071",
      seller: { id: 0, nickname: "" },
      shipping: { free_shipping: true },
      category_id: "MLA1071",
    },
  ],

  // ── PERROS ─────────────────────────────────────────────
  MLA1072: [],   // TODO: agregar productos reales de la categoría Perros

  // ── GATOS ──────────────────────────────────────────────
  MLA1081: [],   // TODO: agregar productos reales de la categoría Gatos

  // ── ACCESORIOS ─────────────────────────────────────────
  MLA1088: [],   // TODO: agregar productos reales de la categoría Accesorios

  // ── ALIMENTACIÓN ───────────────────────────────────────
  MLA434760: [], // TODO: agregar productos reales de Alimentación

  // ── JUGUETES ───────────────────────────────────────────
  MLA1074: [],   // TODO: agregar productos reales de Juguetes

  // ── FALLBACK GENÉRICO ───────────────────────────────────
  default: [],
}
