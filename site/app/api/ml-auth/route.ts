import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { ML_APP_ID } = process.env
  if (!ML_APP_ID) {
    return NextResponse.json({ error: "ML_APP_ID no configurado" }, { status: 500 })
  }

  const origin      = new URL(request.url).origin
  const redirectUri = `${origin}/api/ml-auth/callback`

  const authUrl = new URL("https://auth.mercadolibre.com.ar/authorization")
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("client_id",     ML_APP_ID)
  authUrl.searchParams.set("redirect_uri",  redirectUri)

  return NextResponse.redirect(authUrl.toString())
}
