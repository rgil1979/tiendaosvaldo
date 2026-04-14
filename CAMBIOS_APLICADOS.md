# 🎨 Cambios de Diseño — Tienda Osvaldo

Documento que lista todos los cambios de UX/UI aplicados al proyecto.

---

## ✅ CAMBIOS IMPLEMENTADOS

### 1. **Navbar — Botón "Sobre Osvaldo"**
- ❌ Eliminado estilo `.navPill` (botón naranja sólido prominente)
- ✅ Convertido a `.navGhost` (botón con borde sutil)
- ✅ Aplicado indicador visual de página activa (color naranja + fondo suave)
- **Archivos modificados**: `components/Navbar.tsx`, `components/Navbar.module.css`

### 2. **Navbar — Indicador de página activa**
- ✅ Ya implementado en links principales
- ✅ Extendido también al link "Sobre Osvaldo"
- **Clase CSS**: `.active` (color naranja + fondo suave)

### 3. **Hero — Card de Osvaldo (Reducción de contenido)**
- ❌ Eliminadas 3 métricas pequeñas (500+ / 5★ / 24/7)
- ✅ Mantenida 1 métrica destacada: "500+ productos aprobados"
- ✅ Estructura final de card:
  - Foto/logo de Osvaldo
  - Nombre "Soy Osvaldo"
  - Badge "✅ Chief Sniff Officer"
  - 1 métrica destacada (500+ productos)
  - Botón "🛍 Afiliados de Mercado Libre"
- **Archivos modificados**: `app/page.tsx`, `app/page.module.css`

### 4. **Hero — Círculo decorativo simplificado**
- ✅ Reducida opacidad de `0.4` (40% de transparencia)
- ✅ Aspecto más sutil sin perder identificación visual
- **Clase CSS**: `.osvaldoCard::after`

### 5. **Contraste de texto — WCAG AA**
- ✅ `.heroSub`: Color cambiado a `#555555` (más oscuro que `--muted`)
- ✅ `.osvaldoDesc`: Color cambiado a `#555555` para mejor legibilidad
- **Cumplimiento**: WCAG AA sobre fondo blanco
- **Archivos modificados**: `app/page.module.css`

### 6. **CTAs — Jerarquía de botones**
- ✅ CTA primario "Ver productos →": Mantiene estilo **naranja sólido** (`btn-fill`)
- ✅ CTA secundario "Conocer a Osvaldo": Mantiene estilo **outline/ghost** (`btn-ghost`)
- ✅ Nuevo CTA en card: "Afiliados de Mercado Libre" (naranja sólido, es primario)
- ✅ No hay dos botones naranja del mismo peso visual en la misma vista

### 7. **Trust Indicators — Iconos SVG**
- ❌ Eliminados puntos naranjas pequeños (`.trustDot`)
- ✅ Reemplazados con iconos SVG relevantes:
  - **Comprás en ML**: Icono de checkmark en círculo
  - **Envío a todo el país**: Icono de checkmark
  - **Pagos con MP**: Icono de billetera/tarjeta
- ✅ Todos los iconos en color naranja (`var(--orange)`)
- ✅ Tamaño: 16px
- **Archivos modificados**: `app/page.tsx`, `app/page.module.css`

### 8. **Métrica "24/7 Disponible"**
- ℹ️ Nota: Esta métrica fue eliminada de la card del hero (reducción a 1 métrica)
- 💡 Las características de disponibilidad 24/7 se comunican en el banner "¿Por qué confiar en la selección de Osvaldo?"

### 9. **Optimización de imágenes**
- ✅ Logo aumentado de 36px → 64px (mejora visual sin srcset necesario)
- ✅ Logo del navbar: 64x64px con Image de Next.js
- ✅ Logo de avatars de Osvaldo: Usa `fill` con contenedor relative (eficiente)
- **Archivos modificados**: `components/Navbar.tsx`, `app/page.tsx`

### 10. **Error en consola — 404 de imagen OG**
- 🐛 **Problema encontrado**: `og-image.jpg` no existía en `public/img/`
- ✅ **Solución**: Redireccionado a `/img/logo.jpeg` (imagen existente)
- **Archivos modificados**: `config/site.config.ts`

---

## 📋 CHECKLIST DE REQUIERIMIENTOS

- [x] Navbar: "Sobre Osvaldo" convertido a ghost button con borde
- [x] Navbar: Indicador visual de página activa en todos los links
- [x] Hero - Card: Contenido reducido (foto + nombre + badge + 1 métrica + botón)
- [x] Hero - Card: 3 métricas eliminadas
- [x] Hero - Card: Círculo decorativo simplificado
- [x] Texto del hero: Mayor contraste (#555555)
- [x] Descripción de Osvaldo: Mayor contraste
- [x] CTAs: Jerarquía correcta (sin duplicados de peso visual)
- [x] Trust indicators: Iconos SVG reemplazan puntos
- [x] Error en consola: Imagen OG 404 corregida
- [x] Imágenes: Optimizadas sin nuevas dependencias

---

## 🚀 PRÓXIMOS PASOS (RECOMENDADOS)

1. **Crear og-image.jpg**: Diseñar una imagen OG 1200x630px con branding si es necesario
2. **Revisar página "Sobre Osvaldo"**: Documentar las 3 métricas eliminadas en esa página
3. **Testing**: Verificar en diferentes dispositivos (mobile, tablet, desktop)
4. **Accesibilidad**: Validar contrast ratios en https://webaim.org/resources/contrastchecker/
5. **Performance**: Auditar con Lighthouse en DevTools

---

**Última actualización**: 13 de Abril de 2026
**Stack utilizado**: Next.js 14.2.3 + React 18 + TypeScript + CSS Modules
**Cambios aplicados**: 10 cambios principales | 4 archivos modificados | 1 bug corregido
