# Brief — Tienda Osvaldo 2.0

**Fecha:** 29 de octubre de 2026 · **Responsable:** Rodrigo · **Versión:** 2 (29/10/2026: se suma lo trabajado el 21 y 22/10 que estaba en `Docs/V1`)
**Período de armado:** 29/10/2026 al 28/11/2026
**Sitio:** https://tiendaosvaldo.com.ar · **Repo:** `D:\Github\tiendaosvaldo` (GitHub `rgil1979/tiendaosvaldo`)
**Historia del proyecto:** Notion → Tienda Osvaldo → V1.0, y en el repo `Docs/V1` (tracker y registro de hallazgos, actualizados al 22/10)
**Copias del brief:** Notion (Tienda Osvaldo → V2.0 → Brief), el proyecto de Claude "Tienda Osvaldo 2.0" y el repo (`Docs/V2/BRIEF.md`). Todo cambio se hace en las tres.
**Seguimiento:** el avance del plan de la sección 5 se marca en el [Tracker de V2](https://claude.ai/artifact/5Nho3d7X25euH6Z7TxfAB3) (38 pasos con ID S1-01 a S4-05, estado y notas). Si un paso cambia, se cambia en el tracker y en este brief.

---

## 1. Objetivo

Dejar armado en 30 días un sitio de afiliados de Mercado Libre que funcione en **modo pasivo**: después del armado, 1 a 2 horas por mes de mantenimiento más las tareas fiscales.

- **Sí:** activos que se hacen una vez y no se vencen, mantenimiento automático y contenido humano por tandas.
- **No:** crecer a fuerza de publicar todas las semanas, ni usar Instagram como motor.
- **Ingreso esperado:** chico. No hay meta numérica porque no hay datos de base; se define en la semana 1.

## 2. Punto de partida

Hechos, según las páginas de V1.0 en Notion, el tracker y el registro de hallazgos de `Docs/V1` (21 y 22/10) y la revisión del sitio del 29/10/2026:

| Tema | Estado |
|---|---|
| Sitio | Online desde abril de 2026. Next.js con Docker y Traefik en un VPS de Hostinger. |
| Deploy | Automático desde el 21/10: cada push a `main` publica el sitio (GitHub Actions + `deploy/deploy.sh`, con backup de las últimas 5 versiones, health check y vuelta atrás si falla). |
| Tráfico (Search Console, 3 meses al 21/10) | 11 clics desde Google, posición media 16,9; en las búsquedas principales, entre la 40 y la 55. 144 páginas indexadas. La guía de arena es la mejor posicionada (7,5). |
| Medición | GA4 con Consent Mode v2: 4 usuarios en 90 días, porque solo cuenta a quien acepta cookies. El panel de afiliados separa clics por etiqueta (`guiaalimentoperro`, `guiaarena`, `instagram`, `rodrigogilbulacio`), pero cuenta menos clics que aperturas. Últimos 90 días al 29/10: 28 clics (21 con `rodrigogilbulacio`, 4 con `guiaarena` y 3 con `guiaalimentoperro`, incluidos los de prueba), 2 compradores, 7 órdenes, 13 productos, $ 526.853 en ventas estimadas y $ 37.589 de ganancia estimada (7,1 %; $ 33.221 con `rodrigogilbulacio` y $ 4.368 sin etiqueta en la tabla). Las guías: 0 ventas. `rodrigogilbulacio` mezcla tres cosas: los links de las categorías del sitio, los que Rodrigo comparte con conocidos y los clics de prueba. Según Rodrigo (29/10), las ventas con esa etiqueta son de conocidos suyos: no sirven como línea de base del sitio, y que valgan depende de quiénes son (sección 13). Ventas atribuibles al sitio: 0. Por día (pestaña "Fecha"): 13 clics son pruebas nuestras del 21 y 22/10, incluidos los 7 de las guías (las guías no tuvieron ningún clic real); las 4 fechas con venta son 6/8, 16/9, 13/10 y 27/10. Quedan como mucho 15 clics que no son de prueba en 90 días (unos 5 por mes), parte de ellos de conocidos, y ninguna venta que venga del sitio. |
| Catálogo curado | 103 entradas en `productos-curados.ts`, con link meli.la, sin precio y con títulos de ML. Solo los 11 alimentos y las 4 arenas guardan su ID de catálogo de ML. |
| Fichas `/producto/MLA…` | 106 fichas de la época de la API, indexadas pero sin links desde el sitio desde el 9/6. Son el 55 % de las impresiones y 6 de los 11 clics, pero perdieron cerca del 40 % de sus impresiones desde agosto (coincide con los spam updates de Google). Su botón usa un link armado a mano (`partner_id`), que los términos prohíben, y sus datos estructurados no funcionan. Ese botón no registra clics en el panel de afiliados (prueba del 22/10, T33). Dependen del token de ML: si falla, salen con noindex o 404. |
| Contenido | 2 guías publicadas y corregidas (alimento para raza grande, 21/10; arena, 22/10). La guía del pretal antitirones está escrita y sin publicar (`Docs/V1/borradores/guia-pretal-antitirones.md`). La rama `t41-arenas` (productos nuevos de la guía de arena) espera revisión para publicarse. |
| API de ML | Con token funcionan los productos de catálogo (`/products/{id}`, `/products/{id}/items` con vendedores y precio, `/products/search`). No funcionan las publicaciones sueltas (`/items`, 403) ni la búsqueda (`/sites/MLA/search`, 403). Todo depende de un único token, reautorizado el 21/10; vence a los 6 meses. `/api/ml-auth` es pública y acepta el token de cualquier cuenta. |
| Comisiones | Tabla oficial: 8 % por venta directa y 4 % por indirecta en 20 categorías; 0 % en Alimentos y Bebidas. Animales y Mascotas no figura. En la app, el botón "Ganancia" mostró 15 % en Eukanuba el 21/10, y el 29/10 en los 15 alimentos y arenas del catálogo y en un pretal: parece la tasa de toda la categoría, no una promoción por producto. Falta confirmar si es permanente (T05) y verla aplicada en una venta (pestaña "Productos vendidos"). El 29/10 el asistente de IA de la ayuda de ML dijo que Animales y Mascotas no está habilitada para comisiones de afiliados y que Alimentos y Bebidas está excluida; no es una respuesta oficial, pero coincide con la tabla. Ese mismo día, una persona del soporte (chat de la ayuda, 14:54) respondió que la categoría sí genera comisión para afiliados, siempre que el producto no sea usado, y la ayuda oficial de categorías habilitadas lista "Mascotas (accesorios, alimentos para mascotas)" como habilitada. Lo que no paga es "Alimentos y bebidas" (comida para personas) y lo que no se permite es "Animales". Sobre el 15 %, el soporte dijo que "puede llegar a cambiar" y que en una venta indirecta (otro producto comprado con el mismo link) el porcentaje baja. Atribución: 24 horas desde el clic; la venta de otra categoría paga la mitad. |
| Cobro | Mínimo $ 30.000, de al menos 3 ventas de 3 compradores distintos. Cada venta se valida hasta 60 días desde la entrega. Hay que facturar; el pago llega dentro de los 30 días de la factura, en Mercado Pago. Situación fiscal ya cargada. Al 29/10 la ganancia estimada ($ 37.589) supera el mínimo, pero hay 2 compradores: todavía no se puede cobrar. Además, esas ventas vienen de links que Rodrigo pasó a su novia y a un amigo, fuera de los medios declarados: no contar con esa ganancia hasta que se validen. |
| Programa de afiliados | Solo cuentan las ventas de los medios declarados, y los buscadores no son medios. Declarados: el sitio (como "Otra red") e Instagram. El soporte confirmó el 29/10 que el sitio cuenta como medio (lo toman como blog). Los términos piden un perfil "activo y regular", pero según el soporte (29/10) no hay una frecuencia mínima de publicaciones: alcanza con que el perfil sea público. |
| Instagram | 6 publicaciones (estuvo parado del 8/5 al 22/10) y 10 seguidores. Bio y textos corregidos el 22/10 con la promesa nueva: "Osvaldo te ayuda a elegir". Osvaldo no prueba productos: es la cara de la cuenta y solo se cuenta lo que usa de verdad (pretal Trixie, juguetes y snacks de pollo deshidratado). |
| Confianza | La home todavía dice que Osvaldo probó cada categoría. Para los términos, la información engañosa es causa de suspensión. |
| Contacto | No funciona ningún canal salvo Instagram. `hola@tiendaosvaldo.com.ar` figura en Contacto, Privacidad, Términos y Afiliados, pero no hay cuenta de correo ni MX: rebota. El formulario de Contacto no está configurado (falta `NEXT_PUBLIC_FORMSPREE_ID`). |
| Otros errores visibles | El buscador del sitio nunca devuelve resultados (usa la búsqueda de ML, que da 403). Todos los productos tienen la etiqueta "Nuevo". Hay dos nombres para la misma categoría ("Collares y correas" y "Collares y arneses"). El 26/10 Search Console avisó de páginas duplicadas sin canónica. |
| Reporte automático | No implementado. El workflow está armado (`reporte_analytics_n8n.json`, GA4 + Search Console → Notion), pero nunca se cargó en n8n. Ya tenés una instancia de n8n funcionando con otros workflows. |

## 3. Diagnóstico

1. **Nadie llega.** 11 clics de Google en 3 meses: el problema número uno es el tráfico, no la conversión.
2. **El catálogo no agrega valor.** Títulos de ML sin opinión ni datos propios es lo que Google llama "thin affiliation". Las fichas `/producto/` son la prueba: Google las fue bajando desde agosto.
3. **Lo diferencial no está en el sitio.** Osvaldo casi no aparece, y lo que se dice de él tiene que ser verdad.
4. **Hay riesgos con el programa de afiliados.** La promesa de la home, el botón de las fichas y un Instagram poco activo van contra los términos.
5. **Casi nada se mantiene solo.** El deploy ya es automático, pero no hay alertas, ni reporte, ni revisión del catálogo, y todo lo que usa la API cuelga de un token que vence.

## 4. Estrategia 2.0

**Principio:** cada pieza tiene que (a) responder algo que la gente busca antes de comprar, (b) llevar a un producto con comisión y (c) mantenerse sola o vencerse muy lento.

**Monetización:**
- Animales y Mascotas: la app muestra 15 % en alimentos, arenas y accesorios (29/10), aunque la tabla oficial dice 0 % en alimentos y no lista mascotas. Falta que el soporte confirme si es permanente (T05). Si se mantiene, el alimento es el producto que más deja por venta (Eukanuba 15 kg a $ 111.871 el 21/10: unos $ 16.800), y la calculadora de ración y las guías de alimento suben de prioridad.
- Mientras tanto, el foco es paseo y antitirones: es el tema con más impresiones en Google (posición ~44) y tiene una guía escrita.
- Las ventas de otra categoría dentro de las 24 horas también cuentan, a la mitad.

**Pilares:**

1. **Herramientas, el activo más pasivo:**
   - Calculadora de talle de pretal y collar por medidas (cuello, pecho y peso), cruzada con las tablas de talles de los productos curados. Va con la guía del pretal.
   - Calculadora de ración para 5 a 8 marcas, con las tablas oficiales. Atrae tráfico y deriva a comederos y contenedores.
   - Widget de cuánto dura la arena, dentro de la guía de arena.
2. **Contenido escrito una sola vez durante el mes:** llegar a 8–10 guías en total (hoy hay 2 publicadas y 1 escrita), basadas en fuentes y sin experiencias inventadas.
   - Primero: publicar la guía del pretal antitirones con sus productos.
   - "Royal Canin vs Pro Plan" como entrada de tráfico. Hoy no hay bolsa de Royal Canin de 15 kg con vendedores.
   - "Lo que usa Osvaldo": solo lo que usa de verdad, contado como es.
3. **Catálogo curado:** 30 a 40 productos con una razón para estar. Al recortar, elegir la versión de catálogo (`/p/MLA…`) y guardar su ID de ML: es lo único que la API deja revisar solo. Las categorías sin texto propio llevan `noindex`.
4. **Fichas `/producto/`:** decidir en la semana 1. Mi recomendación: no invertir en ellas. Redirigir las que traen impresiones a su categoría o guía equivalente, y sacar del índice el resto. Están devaluadas por Google, su botón incumple los términos y no registra clics de afiliado (T33), y dependen del token.
5. **Mantenimiento automático** (sección 6).
6. **Instagram semipasivo** (sección 8).

**Precios automáticos:** posibles solo para productos de catálogo con ID guardado (`/products/{id}/items`). Para el resto, el sitio sigue sin mostrar precios. El soporte confirmó (29/10) que se puede mostrar la foto y el precio de los productos tomados de Mercado Libre por la API oficial.

## 5. Plan de 30 días

### Semana 1 (29/10–4/11): cerrar lo pendiente y arreglar lo que incumple
- [ ] Cerrar lo que quedó en curso el 22/10 (confirmar en qué estado está cada una):
  - Revisar en el panel los clics del 22/10 por etiqueta y la pestaña "Fecha" a 90 días (T33, T04). Clics del 22/10 revisados el 29/10: el botón de las fichas no sumó (sección 13). Falta la pestaña "Fecha".
  - Revisar los 8 links nuevos de las arenas y publicar la rama `t41-arenas` (T11, T41).
  - Mandar la consulta al soporte del programa (T05), sumando qué paga Animales y Mascotas y si el sitio fue aceptado como medio.
  - Anotar el porcentaje de "Ganancia" de los alimentos y las arenas (T44).
- [ ] Decidir qué se hace con las 106 fichas `/producto/` (T36) y reemplazar su botón por un link generado en el panel.
- [ ] Arreglos de confianza: corregir la promesa de la home ("Osvaldo te ayuda a elegir"), sacar la etiqueta "Nuevo" y unificar el nombre de la categoría de collares.
- [ ] Canonical en todas las páginas (aviso de Search Console del 26/10).
- [ ] Crear el correo `hola@tiendaosvaldo.com.ar` con Cloudflare Email Routing (reenvío a Gmail, sin casilla propia). Cloudflare agrega MX, SPF y DKIM; sumar a mano el DMARC `v=DMARC1; p=reject;` en `_dmarc`. Probar enviando un mail de prueba.
- [ ] Reemplazar el formulario de Contacto, que no está configurado, por un link a hola@.
- [ ] Buscador: que busque dentro del catálogo curado, sin la API de ML.
- [ ] Token de ML: que `/api/ml-auth` acepte solo la cuenta del sitio, que avise si falla la renovación y guardarlo fuera de la carpeta del código.
- [ ] Registro propio de clics a ML, sin cookies ni datos personales y sin tocar el link de afiliado: el botón mantiene su `meli.la` y avisa del clic al servidor.
- [ ] Fijar la línea de base y los umbrales de la sección 9.

### Semana 2 (5/11–11/11): catálogo y automatizaciones
- [ ] Recortar el catálogo a 30–40 productos, con versión de catálogo e ID de ML, y revisar que cada link lleve a su producto (T42). Los links nuevos del sitio llevan una etiqueta propia (por ejemplo `catalogo`); `rodrigogilbulacio` queda solo para lo que Rodrigo comparte con conocidos.
- [ ] Cargar las tablas de talles de los pretales y collares que quedan.
- [ ] Revisión diaria del catálogo por API (publicación sin vendedores, precio y reputación del vendedor que gana la publicación), alertas y backup del registro de clics.
- [ ] Reporte: importar `reporte_analytics_n8n.json` en tu n8n y cargar las credenciales de GA4, Search Console y Notion.
- [ ] Datos estructurados en JSON-LD (ItemList, Article y BreadcrumbList), sin declarar a Tienda Osvaldo como vendedor.

### Semana 3 (12/11–18/11): herramientas y guía del pretal
- [ ] Guía del pretal antitirones: elegir los productos (enganche en el pecho, doble enganche y uno común), generar los links con la etiqueta `guiapretal` y publicarla (T46). Antes: hacer commit del script `--pretal` y medir el pecho de Osvaldo.
- [ ] Calculadora de talle.
- [ ] Calculadora de ración, con tablas oficiales y aviso de consultar al veterinario.
- [ ] Widget de arena.
- [ ] Sesión de fotos de Osvaldo en su vida diaria: paseo con su pretal, siesta, comida y juego.

### Semana 4 (19/11–28/11): contenido y cierre
- [ ] Publicar las guías que faltan para llegar a 8–10. Borradores asistidos, con edición y datos verificados.
- [ ] Ampliar "Sobre Osvaldo" con su historia y fotos reales.
- [ ] Primer paquete de Instagram: 4 publicaciones (una por semana), programadas.
- [ ] Escribir el instructivo de mantenimiento: qué hacer con cada alerta.
- [ ] Primer reporte y cierre del armado.

## 6. Automatizaciones

| Tarea | Cómo | Frecuencia | Estado |
|---|---|---|---|
| Deploy | GitHub Actions → VPS (`deploy/deploy.sh`) | En cada push a `main` | Funciona desde el 21/10 |
| Clics a ML | El botón avisa al servidor y sigue al `meli.la` sin cambios | Permanente | Planificado |
| Revisión del catálogo | API de catálogo: publicación sin vendedores, precio y reputación del vendedor (el programa exige amarilla o verde); alerta si algo cambia | Diaria | Planificado |
| Precio y precio por kilo | API de catálogo, solo productos con ID de ML | Diaria | Planificado |
| Reporte | n8n: GA4 + Search Console → Notion | Semanal | Armado, sin implementar |
| Alertas | Solo cuando algo se rompe: link sin vendedores, sitio caído, token de ML, errores de indexación | Al ocurrir | Planificado |
| Backups | El deploy guarda las últimas 5 versiones; falta el registro de clics | Semanal | Parcial |
| Certificado SSL | Traefik con Let's Encrypt | Automática | Funciona |
| Instagram | Paquete mensual programado en Meta Business Suite | Mensual | Planificado |
| Factura y token de ML | Recordatorios | Al llegar al mínimo de cobro y cada 6 meses | Planificado |

Lo que vive en el código corre como tareas programadas en el VPS. n8n se usa para el reporte y, si suma, para las alertas.

## 7. Lo que no se automatiza

- Generar los links de afiliado: Mercado Libre no tiene una API para eso, se hacen en el panel con la etiqueta que corresponda.
- Fotos de Osvaldo y lo que se cuenta de lo que usa.
- Cargar y verificar las tablas de talles y de ración.
- El criterio editorial y la edición final de cada texto.
- Reautorizar la app de ML cada 6 meses.
- Emitir la factura y recategorizar el monotributo.
- Leer la web de Mercado Libre de forma automatizada: los términos lo prohíben. Solo la API.

## 8. Instagram semipasivo

- **Rol:** vidriera y cumplimiento. Muestra que la tienda es real, cumple el perfil "activo y regular" que piden los términos y lleva clics medibles con la etiqueta `instagram`. No es un motor de crecimiento. Datos del 29/10: el soporte dijo que no hay frecuencia mínima (alcanza con un perfil público), y en 90 días no hubo ningún clic con la etiqueta `instagram`. Decisión de Rodrigo (29/10): mantener publicaciones activas, 4 por mes. En el corte de los 90 días se mira si la etiqueta `instagram` trae clics.
- **Promesa:** "Osvaldo te ayuda a elegir". Osvaldo aparece en fotos de su vida diaria y opina solo de lo que usa.
- **Ritmo:** 4 publicaciones por mes, una por semana, preparadas en un paquete mensual y programadas de una vez. Alternar Reel (llega a quien no sigue la cuenta) y carrusel.
- **Sí:** plantilla "Opción C" con fotos reales, textos con la voz de Osvaldo aprobados en lote, links con la etiqueta `instagram`.
- **No:** imágenes de Osvaldo generadas con IA, republicar contenido ajeno, ni bots de likes, follows o comentarios. No se compran productos para tener qué mostrar.
- **Historias con link:** si al programarlas desde la computadora no sale el sticker de link, se suben desde el celular o se usa el link de la bio.
- **Rutina:** sesión de fotos cada 2 o 3 meses y aprobación mensual del paquete, de 30 a 45 minutos.

## 9. Medición y criterios de decisión

**Métricas:** impresiones y clics (Search Console), clics a ML (registro propio y panel por etiqueta), ventas y comisiones (panel de ML; las de `rodrigogilbulacio` son de conocidos y no cuentan como ventas del sitio) y uso de las calculadoras. Con el tráfico de hoy, las etiquetas van a mostrar casi cero durante semanas.

- **Día 30 (28/11/2026).** El armado está terminado si funcionan las alertas, el reporte y el registro de clics; el catálogo está recortado; las 2 calculadoras están online; hay 8–10 guías publicadas y el instructivo está escrito.
- **Fin de febrero de 2027 (90 días después del armado).** Se sigue si las impresiones crecen mes a mes y hay clics a ML. Los umbrales exactos se fijan en la semana 1, con la línea de base.
- **Si no se cumple:** cortar o cambiar de canal. No sumar horas para compensar.

## 10. Mantenimiento después del armado

| Frecuencia | Tarea | Tiempo estimado |
|---|---|---|
| Mensual | Leer el reporte y el panel de afiliados, y mirar el % de la barra de afiliados en 2 o 3 productos | 15 min |
| Mensual | Aprobar el paquete de Instagram y generar sus links | 30–45 min |
| Al llegar al mínimo de cobro | Emitir la factura | 10 min |
| Cada 2–3 meses | Sesión de fotos de Osvaldo | 1 h |
| Cada 6 meses | Reautorizar la app de ML (próxima: antes del 21/4/2027) | 5 min |
| Semestral | Recategorización del monotributo (febrero y agosto) | 15–30 min |
| Semestral | Revisar si cambiaron las tablas de ración o de talles | 30 min |
| Anual | Renovar el dominio (antes del 2/4/2027) y el VPS | 15 min |
| Al llegar una alerta | Seguir el instructivo | Variable |

Opcional: cada 3 a 6 meses, una semana intensiva para sumar páginas donde el reporte muestre señal.

## 11. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Suspensión del programa por información engañosa, links armados a mano, Instagram inactivo o ventas por links pasados fuera de los medios declarados | Se pierden las comisiones | Corregir la home, reemplazar el botón de las fichas, sostener 4 publicaciones por mes y no pasar links por WhatsApp ni en persona |
| Animales y Mascotas paga poco o nada | El modelo no cierra | Confirmarlo en la semana 1 (panel y soporte) antes de invertir en contenido de alimento |
| Google no da tráfico a un sitio de afiliados nuevo | El modelo no despega | Pocas páginas con datos propios y herramientas; corte a los 90 días |
| Todo lo que usa la API depende de un token | Sin revisión del catálogo ni precios; las fichas dan 404 | Alerta si falla la renovación y recordatorio cada 6 meses |
| La API solo sirve para productos de catálogo | No se pueden revisar publicaciones sueltas | Curar versiones de catálogo y guardar su ID |
| Competencia en alimento: MejoresCompras, la calculadora oficial de Royal Canin, Hacé Cuentas | Difícil rankear en alimento | Foco en paseo y antitirones, donde ya hay impresiones |
| Cambios en el programa de afiliados de ML | El ingreso cae o desaparece | Sin solución técnica; diversificar queda fuera de V2.0 |
| Raciones mal interpretadas | Salud del animal y credibilidad | Citar al fabricante y avisar que se consulte al veterinario |
| Fiscal: Ingresos Brutos | Multas | Consultar al contador |

## 12. Descartado en V2.0

- **AdSense:** con este tráfico rinde centavos y compite con el clic a ML.
- **Anuncios en buscadores (Google Ads, Shopping, Bing Ads):** los términos los prohíben.
- **Google Shopping gratuito:** la política de Merchant Center excluye las páginas hechas solo para mandar al cliente a otro sitio.
- **Venta de prueba con familiares o desde la propia casa:** los términos la prohíben y la rechazan.
- **Artículos generados con IA y publicados solos:** es lo que Google castiga como contenido a escala.
- **Experiencias de Osvaldo que no pasaron, y comprar productos para mostrar.**
- **Sumar productos:** el catálogo se recorta.
- **Páginas de pretal por raza:** el talle depende de la marca y de las medidas, no de la raza.
- **Newsletter:** requiere esfuerzo continuo. Se reevalúa cuando haya tráfico.
- **Instagram como motor de crecimiento.**

## 13. Datos a confirmar en la semana 1

- [x] Qué paga Animales y Mascotas, en alimentos y en accesorios (T44): la app muestra 15 % en los 11 alimentos, las 4 arenas y el pretal Trixie (29/10).
- [x] **Si Mascotas paga comisión (consulta T05): sí.** La ayuda oficial de categorías habilitadas lista "Mascotas (accesorios, alimentos para mascotas)" como habilitada, la barra de afiliados muestra 15 % y una persona del soporte lo confirmó (29/10). El asistente de IA se equivocó: lo que no paga es "Alimentos y bebidas" (comida para personas) y lo que no se permite es "Animales". Requisitos: producto nuevo o reacondicionado y vendedor con reputación amarilla o verde (el soporte dijo "verde", y que si el vendedor que gana la publicación pasa a tener peor reputación, probablemente se pierde la comisión).
- [x] Si el 15 % es permanente (soporte, 29/10): no está garantizado, "puede llegar a cambiar". Es la tasa de venta directa; en una venta indirecta baja. Para planificar, usar menos de 15 % y mirar la barra una vez por mes.
- [x] Si el sitio, declarado como "Otra red", fue aceptado como medio (T05): sí, lo toman como blog (soporte, 29/10).
- [x] Si el botón de las fichas `/producto/` sumó clics en el panel (T33): **no**. El 22/10 el panel muestra un solo clic, con `guiaarena` (la previsualización de las 11:18). El clic de prueba en la ficha de Eukanuba (08:28) no aparece ni sin etiqueta ni con `rodrigogilbulacio`, con datos actualizados al 29/10. Es una sola prueba y el panel a veces cuenta menos clics que aperturas, pero coincide con la del 21/10: el botón abre la app sin pasar por el perfil de afiliado.
- [ ] En qué estado quedaron las tareas del tracker entre el 23 y el 29/10 (la última actualización es del 22/10).
- [ ] Que el usuario del token de ML (ID 57351994) sea la cuenta del sitio (T37).
- [ ] Cómo te toca Ingresos Brutos según tu provincia (contador).
- [x] Quiénes son los compradores con `rodrigogilbulacio` (29/10): la novia de Rodrigo y un amigo, y a los dos les pasó el link él. Ninguna de las dos ventas entró por un medio declarado (sitio o Instagram), y la de la novia puede contar además como cuenta vinculada. Según la ayuda oficial (29/10), una venta se rechaza por cuenta vinculada (compra desde el celular, la red de internet o la dirección de entrega del afiliado), publicidad no permitida, cuenta suspendida u otras irregularidades, y una venta rechazada obliga a cambiar la conducta para evitar la suspensión. La del amigo puede validarse si compró con su celular, su red y su dirección; la de la novia, solo si cumple lo mismo. El panel ya muestra 1 venta no efectiva. No contar con esos $ 37.589 hasta que se validen. No buscar un tercer comprador conocido para llegar al mínimo de cobro, y no pasar más links por fuera del sitio e Instagram. Decidido el 29/10: no se consulta al soporte por WhatsApp, así que la regla queda fija.

---

## Fuentes

- Notion → Tienda Osvaldo → V1.0: Hoja de ruta, Documentación técnica, Decisiones tomadas, Plan de acción y Manual.
- Repo: `Docs/V1/tracker.md` y `Docs/V1/registro-hallazgos.md` (21 y 22/10/2026), `deploy/README.md`, `guia_configuracion_n8n.md`.
- [Mercado Libre: términos del programa de afiliados](https://www.mercadolibre.com.ar/ayuda/30228) y [cómo calcular la retribución](https://www.mercadolibre.com.ar/ayuda/27913)
- [Mercado Libre: qué productos se pueden recomendar (categorías habilitadas)](https://www.mercadolibre.com.ar/ayuda/30088)
- [Google: políticas de spam (thin affiliation, contenido a escala)](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google: cómo escribir reseñas de calidad](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews)
- [Google Merchant Center: abuso de la red de fichas gratuitas](https://support.google.com/merchants/answer/12077185)
- [Meta: publicación de contenido en Instagram por API](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [TechCrunch: Instagram prioriza el contenido original (abril de 2024)](https://techcrunch.com/2024/04/30/instagram-is-updating-its-ranking-systems-to-surface-more-content-from-smaller-original-creators)
- [Relevant Audience: Instagram limitará el alcance de los perfiles de IA sin etiqueta](https://www.relevantaudience.com/social-media-marketing/instagram-ai-generated-profile-label-reach-limit/)
- [Royal Canin Argentina: calculadora de ración](https://www.royalcanin.com/ar/cat-and-dog-feeding-calculator)
- [MejoresCompras: Royal Canin vs Pro Plan](https://mejorescompras.com.ar/mascotas/royal-canin-vs-pro-plan-alimento-perros-argentina-2026)
- [La Capital: recategorización del monotributo 2026](https://www.lacapital.com.ar/economia/recategorizacion-del-monotributo-2026-que-hay-que-saber-fechas-clave-y-como-hacer-el-tramite-online-n10238411.html/amp)
