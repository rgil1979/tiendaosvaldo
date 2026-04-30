import { NextResponse } from "next/server"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { cookies } from "next/headers"
import { reloadTokenFromCache } from "@/lib/mercadolibre"

export async function GET(request: Request) {
  const url   = new URL(request.url)
  const code  = url.searchParams.get("code")
  const error = url.searchParams.get("error")

  if (error || !code) {
    return NextResponse.json(
      { error: error ?? "ML no devolvió un código de autorización" },
      { status: 400 },
    )
  }

  const { ML_APP_ID, ML_CLIENT_SECRET } = process.env
  if (!ML_APP_ID || !ML_CLIENT_SECRET) {
    return NextResponse.json({ error: "Credenciales ML no configuradas" }, { status: 500 })
  }

  const cookieStore   = cookies()
  const codeVerifier  = cookieStore.get("ml_code_verifier")?.value
  if (!codeVerifier) {
    return NextResponse.json({ error: "code_verifier no encontrado — iniciá el flujo desde /api/ml-auth" }, { status: 400 })
  }

  const base        = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin
  const redirectUri = `${base}/api/ml-auth/callback`

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "authorization_code",
      client_id:     ML_APP_ID,
      client_secret: ML_CLIENT_SECRET,
      code,
      redirect_uri:  redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    return NextResponse.json({ error: "Falló el intercambio de tokens", detail }, { status: 502 })
  }

  const data: {
    access_token:  string
    refresh_token: string
    expires_in:    number
    user_id:       number
  } = await res.json()

  const expiresAt = Date.now() + Math.max((data.expires_in ?? 21600) - 300, 0) * 1000

  // Guardar en cache en disco (lo lee mercadolibre.ts al arrancar)
  const cachePath = join(process.cwd(), ".ml-token-cache.json")
  writeFileSync(
    cachePath,
    JSON.stringify({ token: data.access_token, refreshToken: data.refresh_token, expiresAt }),
    "utf8",
  )

  // Recargar token en memoria del proceso actual
  reloadTokenFromCache()

  // Actualizar .env para persistir entre deploys
  try {
    const envPath = join(process.cwd(), ".env")
    let env = readFileSync(envPath, "utf8")
    env = env
      .replace(/^ML_ACCESS_TOKEN=.*/m,  `ML_ACCESS_TOKEN=${data.access_token}`)
      .replace(/^ML_REFRESH_TOKEN=.*/m, `ML_REFRESH_TOKEN=${data.refresh_token}`)
    writeFileSync(envPath, env, "utf8")
  } catch {
    // Si no puede actualizar .env, el cache en disco es suficiente para esta sesión
  }

  const expiresInMin = Math.round((data.expires_in ?? 21600) / 60)

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Autenticación ML — OK</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #fdf6f0; color: #3b2a1a; }
    .card { background: white; border-radius: 16px; padding: 40px; max-width: 480px;
            text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    h1 { color: #e8622a; margin-bottom: 8px; }
    p  { color: #7a6352; line-height: 1.6; }
    .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; border-radius: 50px;
             padding: 4px 14px; font-size: 13px; font-weight: 700; margin-top: 16px; }
    a { color: #e8622a; font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>✅ Autenticación exitosa</h1>
    <p>Tokens de MercadoLibre actualizados correctamente.</p>
    <p>El token expira en <strong>${expiresInMin} minutos</strong> y se renovará automáticamente.</p>
    <div class="badge">Usuario ID: ${data.user_id}</div>
    <br><br>
    <a href="/">← Volver a la tienda</a>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  )
}
