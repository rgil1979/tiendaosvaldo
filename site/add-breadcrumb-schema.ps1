# ============================================================
# add-breadcrumb-schema.ps1 — Tienda Osvaldo
# Agrega BreadcrumbList schema al generateMetadata de producto
# Ejecutar desde: D:\Github\tiendaosvaldo\site
# ============================================================

$pageFile = "./app/producto/[id]/page.tsx"

$content = Get-Content -LiteralPath $pageFile -Raw
$contentNorm = $content -replace "`r`n", "`n"

# ── Bloque viejo: schema solo con Product ───────────────────
$oldSchema = @'
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.short_description ?? p.name,
      image: p.pictures.map((pic: { url: string }) => pic.url),
      offers: {
        "@type": "Offer",
        url: `${siteConfig.url}/producto/${id}`,
        priceCurrency: "ARS",
        price: p.price,
        availability: "https://schema.org/InStock",
        itemCondition: p.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
      },
    }

    return {
      title:       p.name,
      description: p.short_description?.slice(0, 155) ||
        `${p.name} – disponible en Mercado Libre`,
      robots:      { index: true, follow: true },
      openGraph: {
        title:  p.name,
        images: p.pictures[0] ? [{ url: p.pictures[0].url }] : [],
      },
      other: {
        "script:ld+json": JSON.stringify(schema),
      },
    }
'@

# ── Bloque nuevo: Product + BreadcrumbList ──────────────────
$newSchema = @'
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.short_description ?? p.name,
      image: p.pictures.map((pic: { url: string }) => pic.url),
      offers: {
        "@type": "Offer",
        url: `${siteConfig.url}/producto/${id}`,
        priceCurrency: "ARS",
        price: p.price,
        availability: "https://schema.org/InStock",
        itemCondition: p.condition === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
      },
    }

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

    return {
      title:       p.name,
      description: p.short_description?.slice(0, 155) ||
        `${p.name} – disponible en Mercado Libre`,
      robots:      { index: true, follow: true },
      openGraph: {
        title:  p.name,
        images: p.pictures[0] ? [{ url: p.pictures[0].url }] : [],
      },
      other: {
        "script:ld+json": JSON.stringify(productSchema),
        "script:ld+json:breadcrumb": JSON.stringify(breadcrumbSchema),
      },
    }
'@

$oldSchemaNorm = $oldSchema -replace "`r`n", "`n"
$newSchemaNorm = $newSchema -replace "`r`n", "`n"

if ($contentNorm.Contains($oldSchemaNorm)) {
    $updated = $contentNorm.Replace($oldSchemaNorm, $newSchemaNorm)
    Set-Content -LiteralPath $pageFile -Value $updated -NoNewline
    Write-Host "✅ BreadcrumbList agregado correctamente a page.tsx" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verificá en: view-source:http://localhost:3000/producto/MLA21806797" -ForegroundColor White
    Write-Host "Buscá 'BreadcrumbList' en el código fuente." -ForegroundColor Gray
} else {
    Write-Host "⚠️  No se encontró el bloque esperado en page.tsx." -ForegroundColor Yellow
    Write-Host "   Es posible que el archivo haya sido modificado manualmente." -ForegroundColor Yellow
    Write-Host "   Avisale al asesor para ajustar el script." -ForegroundColor Yellow
}
