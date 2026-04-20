import { NextRequest, NextResponse } from "next/server"
import { getProducts, getProducts_batch } from "@/lib/mercadolibre"

// Usado por FeaturedProducts.tsx (client component legacy)
// Devuelve MLProductFull[] para que ProductCard funcione

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query    = searchParams.get("q")       ?? undefined
  const domainId = searchParams.get("domain")  ?? "MLA-CAT_AND_DOG_FOODS"
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "8"), 20)
  const offset   = parseInt(searchParams.get("offset") ?? "0")

  try {
    const result   = await getProducts({ query, domainId, limit, offset })
    const products = result.products.length
      ? await getProducts_batch(result.products.map((p) => p.id))
      : []

    return NextResponse.json({
      results: products,
      paging:  { total: result.total, offset, limit, primary_results: products.length },
    })
  } catch (e) {
    console.error("[API /ml-search] Error:", (e as Error).message)
    return NextResponse.json(
      { results: [], paging: { total: 0, offset, limit, primary_results: 0 } },
      { status: 200 } // 200 para que el cliente no rompa
    )
  }
}
