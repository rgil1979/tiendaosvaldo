// IDs del catálogo de Mercado Libre Argentina (extraídos de URLs con /p/MLA...)
// Todos verificados — aparecen en páginas reales de ML

export interface CuratedProduct {
  id: string
  category: "perros" | "gatos"
}

export const curatedProducts: CuratedProduct[] = [
  // PERROS — alimentos
  { id: "MLA49899402", category: "perros" }, // Mister Pet adulto 20 kg
  { id: "MLA20597061", category: "perros" }, // Royal Canin Medium Adulto 15 kg
  { id: "MLA21788541", category: "perros" }, // Purina Pro Plan Adulto raza mediana 15 kg
  { id: "MLA15168925", category: "perros" }, // Pedigree Adulto carne/pollo 21 kg
  { id: "MLA15152920", category: "perros" }, // Excellent Adulto pollo y arroz 20 kg
  { id: "MLA8755744",  category: "perros" }, // Royal Canin Club Performance Adulto 20 kg
  // GATOS — alimentos
  { id: "MLA15171595", category: "gatos" }, // Whiskas Adultos carne 10 kg
  { id: "MLA42568768", category: "gatos" }, // Excellent Mantenimiento gato adulto 15 kg
  { id: "MLA17893844", category: "gatos" }, // Iams Adulto pollo 15 kg
  { id: "MLA25893767", category: "gatos" }, // Raza gatos adultos pescado 15 kg
]

export const allCuratedProductIds = curatedProducts.map((p) => p.id)

export const curatedProductsByCategory = {
  perros: curatedProducts.filter((p) => p.category === "perros").map((p) => p.id),
  gatos:  curatedProducts.filter((p) => p.category === "gatos").map((p) => p.id),
}
