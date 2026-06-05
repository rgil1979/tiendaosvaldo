# ============================================================
# add-breadcrumb-dynamic.ps1 — Tienda Osvaldo
# BreadcrumbList dinámico usando domain_id del producto
# Ejecutar desde: D:\Github\tiendaosvaldo\site
# ============================================================

$pageFile = "./app/producto/[id]/page.tsx"

$content = Get-Content -LiteralPath $pageFile -Raw
$contentNorm = $content -replace "`r`n", "`n"

# ── 1. Agregar import de SLUG_CONFIG si no existe ───────────
if (-not $contentNorm.Contains("SLUG_CONFIG")) {
    $contentNorm = $contentNorm -replace `
        'import \{ siteConfig \} from "@/config/site\.config"', `
        'import { siteConfig, SLUG_CONFIG } from "@/config/site.config"'
    Write-Host "✅ Import de SLUG_CONFIG agregado" -ForegroundColor Green
} else {
    Write-Host "ℹ️  SLUG_CONFIG ya estaba importado" -ForegroundColor Cyan
}

# ── 2. Reemplazar schema estático por dinámico ──────────────
$oldSchema = @'
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Mascotas",
          item: `${siteConfig.url}/categoria/mascotas`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.name,
          item: `${siteConfig.url}/producto/${id}`,
        },
      ],
    }
'@

$newSchema = @'
    const categorySlug = Object.entries(SLUG_CONFIG).find(
      ([, cfg]) => cfg.domainId === p.domain_id
    )?.[0] ?? "mascotas"

    const categoryLabel = SLUG_CONFIG[categorySlug]?.label ?? "Mascotas"

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryLabel,
          item: `${siteConfig.url}/categoria/${categorySlug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: p.name,
          item: `${siteConfig.url}/producto/${id}`,
        },
      ],
    }
'@

$oldSchemaNorm = $oldSchema -replace "`r`n", "`n"
$newSchemaNorm = $newSchema -replace "`r`n", "`n"

if ($contentNorm.Contains($oldSchemaNorm)) {
    $updated = $contentNorm.Replace($oldSchemaNorm, $newSchemaNorm)
    Set-Content -LiteralPath $pageFile -Value $updated -NoNewline
    Write-Host "✅ BreadcrumbList dinámico aplicado correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verificá en: view-source:http://localhost:3000/producto/MLA21806797" -ForegroundColor White
    Write-Host "Buscá 'BreadcrumbList' — ahora la categoría viene del domain_id del producto." -ForegroundColor Gray
} else {
    Write-Host "⚠️  No se encontró el breadcrumb estático para reemplazar." -ForegroundColor Yellow
    Write-Host "   Puede que el script anterior no se haya ejecutado todavía." -ForegroundColor Yellow
    Write-Host "   Ejecutá primero add-breadcrumb-schema.ps1 y luego este." -ForegroundColor Yellow
}
