import { NextRequest, NextResponse } from "next/server"
import { searchProducts } from "@/lib/mercadolibre"
import { curatedProducts } from "@/data/curated-products"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get("category") ?? ""
  const limit    = parseInt(searchParams.get("limit")  ?? "8")
  const offset   = parseInt(searchParams.get("offset") ?? "0")
  const sort     = searchParams.get("sort")     ?? "relevance"
  const priceMin = searchParams.get("priceMin") ? parseInt(searchParams.get("priceMin")!) : undefined
  const priceMax = searchParams.get("priceMax") ? parseInt(searchParams.get("priceMax")!) : undefined

  // 1. Intentamos la API de ML (ya tiene manejo de errores interno — devuelve vacío si falla)
  const result = await searchProducts({ categoryId: category, limit, offset, sort, priceMin, priceMax })

  if (result.results.length > 0) {
    return NextResponse.json(result, { status: 200 })
  }

  // 2. Fallback: datos curados estáticos
  const curated = curatedProducts[category] ?? curatedProducts["default"] ?? []
  const paginated = curated.slice(offset, offset + limit)

  return NextResponse.json(
    {
      results: paginated,
      paging: { total: curated.length, offset, limit, primary_results: paginated.length },
      filters: [],
      available_filters: [],
      source: "curated",
    },
    { status: 200 }
  )
}
