import { NextResponse } from "next/server"
import { randomBytes, createHash } from "crypto"

export async function GET(request: Request) {
  const { ML_APP_ID } = process.env
  if (!ML_APP_ID) {
    return NextResponse.json({ error: "ML_APP_ID no configurado" }, { status: 500 })
  }

  const base        = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  const redirectUri = `${base}/api/ml-auth/callback`

  // PKCE
  const codeVerifier  = randomBytes(32).toString("base64url")
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url")

  const authUrl = new URL("https://auth.mercadolibre.com.ar/authorization")
  authUrl.searchParams.set("response_type",          "code")
  authUrl.searchParams.set("client_id",              ML_APP_ID)
  authUrl.searchParams.set("redirect_uri",           redirectUri)
  authUrl.searchParams.set("code_challenge",         codeChallenge)
  authUrl.searchParams.set("code_challenge_method",  "S256")
  authUrl.searchParams.set("scope",                  "read offline_access")

  const res = NextResponse.redirect(authUrl.toString())
  res.cookies.set("ml_code_verifier", codeVerifier, {
    httpOnly: true,
    secure:   true,
    sameSite: "lax",
    maxAge:   600, // 10 minutos
    path:     "/",
  })
  return res
}
