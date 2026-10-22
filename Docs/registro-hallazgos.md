# Registro de hallazgos · Tienda Osvaldo

> Qué es: lo que vamos encontrando al investigar el sitio, con la fuente de cada dato. Las tareas viven en `tracker.md`; acá queda el porqué.
> Cómo se lee: las entradas más nuevas van primero. Cada hallazgo separa **Dato** (verificado en una fuente), **Interpretación** (opinión o hipótesis) y **Pendiente**.
> Última actualización: 2026-10-22

## Qué sabemos hoy (resumen)

1. **No llega gente.** Google conoce el sitio (144 páginas indexadas), pero lo muestra lejos: posición media 16,9, y en las búsquedas principales entre la 40 y la 55. Últimos 3 meses: 11 clics desde Google. (T02, T03)
2. **Las fichas `/producto/MLA…` son lo que más aparece en Google**: 55 % de las impresiones y 6 de los 11 clics. Pero desde el 9/6 ninguna página del sitio las enlaza, no están en el sitemap y no sabemos si su botón genera comisión. (T33, T36)
3. **Desde mediados de agosto las fichas perdieron cerca del 40 % de sus impresiones**, en dos escalones que coinciden con los spam updates de Google de agosto y septiembre. La falta de links internos quedó descartada como causa principal. Hipótesis principal: Google las trata como afiliación de bajo valor. (T36)
4. **Los datos estructurados de las fichas no funcionan**: Google no detecta ningún dato de producto. (T36)
5. **El sitemap ya está completo**: desde el 22/10 tiene 20 URLs, incluida la guía de arena (la página mejor posicionada), con fechas de modificación reales. Google lo volvió a leer el 22/10 (estado "Correcto", 20 páginas descubiertas); no lo leía desde el 9/6. La guía de arena ya no cuenta una experiencia inventada y tiene un título pensado para las búsquedas de compra. (T35, T41, T32, H21)
6. **Las categorías de alimento ya tienen productos**: 10 alimentos de catálogo con 13 o más vendedores, publicados el 21/10 (T08, H14). La guía de alimento para raza grande ya muestra Pro Plan y Eukanuba, con el texto corregido según las fichas oficiales (T09, H16).
7. **Analytics cuenta menos de lo real**: solo registra a quien acepta las cookies. (T34)
8. **Todo lo que usa la API de Mercado Libre depende de un solo token.** Se volvió a autorizar el 21/10 (T37). La búsqueda de Mercado Libre está cerrada, así que el buscador del sitio nunca devuelve resultados. La API permite revisar productos de catálogo, pero no publicaciones sueltas, y los curados no guardan su ID. La ficha con más impresiones (Purina) manda a un producto que hoy no vende nadie. (T28, T29, T37, T38, T39)
9. **Ya se puede saber qué clics salen de la guía de alimento:** sus links llevan la etiqueta `guiaalimentoperro` (verificado). Para la guía de arena e Instagram las etiquetas ya existen, pero falta generar los links. La home y las categorías quedan juntas en `rodrigogilbulacio`. Con el tráfico de hoy, las etiquetas van a mostrar casi cero durante semanas. (T10, T11, H17)
10. **Las reglas del programa afectan al sitio:** solo cuentan los medios declarados, para cobrar hace falta ser monotributista o RI (Rodrigo ya tiene la situación fiscal cargada), la ventana es de 24 horas y el mínimo de cobro es $ 30.000 en 3 ventas de 3 personas. El botón de las fichas `/producto/` es un link armado a mano, algo que los términos prohíben. Los términos piden además ser creador en redes con un perfil "activo y regular": hoy Instagram tiene 7 publicaciones y 10 seguidores. El sitio e Instagram figuran como redes en el perfil de afiliado. (T06, T33, T36, T43, H18, H20)
11. **El panel separa los clics por etiqueta, pero cuenta menos clics que aperturas.** Los 12 clics del 15 al 21/10 parecen ser todos de pruebas, y del 8 al 14/10 hubo 2 clics y al menos una venta. (T04, T33, H19)

Lo urgente ya está hecho: la app de Mercado Libre se volvió a autorizar el 21/10 (T37). Lo que define el próximo paso: la prueba de la T33, es decir, si el botón de las fichas genera comisión.

---

## 2026-10-22 · Guía de arena: texto, título y productos (T41, T32, T35, T11)

Tareas: T11, T32, T35, T41, T42.

**Fuentes**
- Search Console, exportación de rendimiento de los últimos 3 meses (21/10): consultas y páginas.
- [Cat Litter Science: Why to Let Your Cat Choose](https://www.fearfreehappyhomes.com/cat-litter-science-why-to-let-your-cat-choose/), Fear Free Happy Homes (Beth Adelman, revisado por un veterinario especialista en conducta).
- [Bandeja de arena de cristal ScoopFree](https://www.petsafe.com/es/p/bandeja-del-arenero-desechable-para-arena-de-cristal-scoopfree/PAC10-18162/), PetSafe (fabricante).
- Búsqueda en el catálogo de Mercado Libre del 22/10, corrida por Rodrigo en el servidor con `scripts/buscar-alimentos-ml.mjs --arena`: 16 búsquedas, 170 productos revisados, 52 con vendedores. Resultado completo en `/app/arena-ml.json`.
- Producción revisada el 22/10 con el navegador integrado.
- Captura del generador de links que pasó Rodrigo (22/10, 11:18).

### H21 · Los productos de la guía de arena contradecían la guía, y las Zootec tienen pocos vendedores

**Dato.**
- La guía de arena tiene posición media 7,5 y CTR 1 % (96 impresiones en 3 meses). Las búsquedas del sitio con posición media entre 5 y 10,5 son todas de compra: "bolsa de arena para gatos" (19 impresiones, 8,5), "bolsa de arena para gato" (3, 5), "bolsa arena para gato" (3, 9), "cuanto sale la arena para gatos" (3, 10) y "cuanto cuesta una bolsa de arena para gato" (2, 10,5).
- Fear Free: la mayoría de los gatos prefiere arena sin perfume, suave y de grano fino, y aglutinante. En un estudio con pellets de madera, sílice y arcilla, eligieron sílice o arcilla antes que los pellets y, entre esas dos, arcilla, sobre todo para defecar. PetSafe: la bandeja de cristales dura hasta 30 días con un solo gato.
- Las dos Catit Go Natural de la guía son perfumadas: vainilla (`MLA60924254`) y lavanda (`MLA27724749`).
- Zootec 24 kg (`MLA48897680`): 2 vendedores, sin olor. Zootec 30 kg (`MLA49294007`): no apareció en ninguna de las 16 búsquedas.
- Aglutinantes de catálogo con "Sin fragancia" o "Sin olor" en los datos de Mercado Libre y 10 o más vendedores: Rubicat Classic 5,3 kg (`MLA19994394`, 30, bentonita), Sanicat Strong Clumps 7 kg (`MLA20935047`, 26), Catit Go Natural Sin Aromas 5,6 kg (`MLA62573112`, 18, cáscara de guisante) y Rubicat Sensitive Microesferas 5 kg (`MLA59585772`, 11). Otras con 10 o más vendedores dicen "Neutra" o "Neutro".
- En producción, la guía de alimento mostraba los links de "Fuentes", el separador y la nota final como texto crudo: el código de las guías no convertía links, cursiva ni `---`.
- El generador de links tiene su propio selector de "Etiqueta en uso" y acepta varias URLs a la vez. Cada link generado suma el producto a la lista "Mis recomendaciones" del perfil social.

**Interpretación.**
- *Inferencia:* las búsquedas de compra entre las posiciones 5 y 10,5 son de la guía, porque la categoría de arena tiene posición media 20,6. La exportación no cruza búsquedas con páginas.
- *Especulación:* el título viejo ("aglutinante o sílice") no le habla a quien busca una bolsa para comprar, y eso explicaría el CTR de 1 %. Con este volumen, el efecto del título nuevo tarda 1 o 2 meses en verse.
- Sin la experiencia inventada, la guía se apoya en fuentes, y los productos tienen que ser coherentes con ellas. Por eso se cambiaron los cuatro: aglutinantes sin fragancia, de catálogo y con 10 o más vendedores, con marcas y precios distintos.
- "Neutra" puede querer decir sin perfume o no: esas se dejaron afuera.
- Las Zootec y las Catit perfumadas siguen en la categoría de arena, donde no contradicen nada.

**Pendiente.**
- Hecho el 22/10: la guía, el sitemap y el script se publicaron (`cfd14db`) y Claude los verificó en producción. Rodrigo reenvió el sitemap y Google lo leyó ese día (20 páginas descubiertas).
- Claude, 23/10: abrir los 8 links nuevos y revisar el producto y la etiqueta. Si están bien, Rodrigo publica la rama `t41-arenas`.
- Revisar si la Zootec de 30 kg tiene vendedores (T42).

---

## 2026-10-22 · Medios declarados (T43)

Tareas: T05, T15, T16, T42, T43.

**Fuentes**
- [Términos del programa](https://www.mercadolibre.com.ar/ayuda/30228), puntos 2.1, 3.2 y 6.5, leídos el 22/10 con el navegador integrado y sin iniciar sesión.
- Perfil público de Instagram [@tiendaosvaldo](https://www.instagram.com/tiendaosvaldo/), visto el 22/10.
- `site/config/site.config.ts`: la cuenta de Instagram que figura en el sitio.
- Capturas del panel de afiliados que pasó Rodrigo el 22/10: pantalla principal (09:08), Configuración (09:09) y Editar perfil (09:11).

### H20 · Qué cuenta como medio y en qué estado está Instagram

**Dato.**
- 3.2: son medios "las redes sociales, medios, sitios y blogs personales y públicos informados por el Afiliado". Mercado Libre puede rechazar un medio, lo que se publica fuera de los medios no cuenta y los buscadores no son medios.
- 2.1, requisitos para todos los afiliados: "Ser una persona que crea y comparte contenido (…) en plataformas de redes sociales" y "Tener un perfil público activo, de uso propio y regular en los Medios", como Facebook, Instagram, TikTok, YouTube, Twitter, blogs "u otros medios previo análisis de Mercado Libre".
- 6.5: 30 días desde el alta para validar la identidad en Mercado Pago y 60 para presentar la documentación fiscal. Es lo que la prensa llama "modo prueba".
- Instagram @tiendaosvaldo: público, 7 publicaciones y 10 seguidores. Es la cuenta que figura en la configuración del sitio.
- La ayuda pública no dice en qué menú se ven o se editan los medios. La página `/l/afiliados` mandó a una verificación de cuenta y no se siguió.
- En el panel, los medios están en Editar perfil > "Redes sociales | Opcional", con el texto "Cuantas más redes agregues, más ganás". En "Cuentas vinculadas" figuran Instagram `tiendaosvaldo` y, como "Otra red", `https://www.tiendaosvaldo.com.ar`. Esa URL redirige a `tiendaosvaldo.com.ar` (verificado el 22/10).
- Configuración no tiene una sección de medios. Ni la pantalla principal ni Configuración muestran avisos de documentación, de validación o de cuenta en revisión.

**Interpretación.**
- Editar perfil > Redes sociales es el único lugar del panel donde se informan medios, así que lo más probable es que sea lo que los términos llaman "medios informados por el Afiliado". Mercado Libre no lo dice, y el panel no muestra si aceptó cada medio.
- El sitio entra como "sitio propio" (3.2), pero en los requisitos queda entre los "otros medios previo análisis". *Opinión:* lo que cumple con el perfil de creador que piden los términos es Instagram, no el sitio.
- *Opinión:* con 7 publicaciones en total, Instagram queda flojo frente a "activo y regular". Mercado Libre no dice cuánta actividad alcanza. No hace perder ventas por sí solo, pero si Mercado Libre revisa la cuenta, el argumento para seguir en el programa es Instagram. Suma un motivo de cumplimiento a la T15 y la T16, además del tráfico.
- No conviene iniciar sesión de Mercado Libre en el navegador integrado: Claude va a abrir desde ahí los `meli.la` de la T42. *Especulación:* los clics en los propios links con la sesión del afiliado pueden filtrarse o verse como clics propios.

**Pendiente.**
- Sumar a la consulta de la T05: si el sitio, cargado como "Otra red", cuenta como medio aceptado.
- Instagram activo y regular (T15, T16).

---

## 2026-10-22 · Primer control del panel con etiquetas

Tareas: T04, T10, T11, T33.

**Fuentes**
- Capturas del panel de afiliados que pasó Rodrigo el 22/10 a las 08:21: resumen de los últimos 7 días, y Métricas del 15 al 21/10 con la pestaña "Etiquetas de seguimiento".
- Lista de aperturas de links del 21/10, con su hora (H17).

### H19 · El panel separa por etiqueta, pero cuenta menos clics que aperturas

**Dato.**
- Resumen "Tus últimos 7 días hasta el 22/oct": 12 clics, 0 pedidos, $ 0.
- Métricas del 15 al 21/10 ("Actualizado hasta el 22/oct"): 12 clics, un 500 % más que el período anterior, o sea que del 8 al 14/10 hubo 2 clics. Compradores, órdenes, ventas y ganancia están en 0, y todos bajan un 100 %: el período anterior tuvo ventas.
- Por etiqueta: 3 con `guiaalimentoperro`, 3 con `guiaarena` y 6 con `rodrigogilbulacio`. No aparecen filas de `guiaalimento`, `gualimento`, `instagram` ni sin etiqueta.
- Aperturas conocidas del 21/10: con `guiaalimentoperro`, 3 (Rodrigo a las 21:22 y Claude 2 a las 21:36); con `guiaarena`, más de 5 (Claude abrió 5 links distintos a las 21:38, más las de Rodrigo); con `rodrigogilbulacio`, más de 10 (Claude 9 entre las 21:33 y las 21:37, más las de Rodrigo).

**Interpretación.**
- El panel separa los clics por etiqueta: la T10 y la T11 funcionan de punta a punta.
- El panel cuenta menos clics que aperturas. *Especulación:* agrupa las aperturas repetidas de una misma persona o filtra algunas. Mercado Libre no explica cómo cuenta. El número sirve para comparar etiquetas, no para contar pruebas una por una.
- Lo más probable es que los 12 clics sean todos de las pruebas del 21/10: la T04 ya decía 0 clics del 14 al 20/10. Si es así, esa semana no hubo ningún clic de visitantes. Falta confirmarlo con la pestaña "Fecha".
- Del 8 al 14/10 hubo 2 clics y al menos una venta.
- El clic de la T33 del 21/10 (botón de la ficha de Eukanuba) no se puede separar: no hay ninguna fila sin etiqueta.

**Pendiente.**
- Pestaña "Fecha" a 90 días (T04).
- Prueba limpia de la T33: clic el 22/10 a las 08:28, sin abrir ningún `meli.la` ese día. Revisar el 23/10 los clics del 22/10.

---

## 2026-10-21 · Reglas del programa de afiliados (fuente oficial)

Tareas: T05, T06, T33, T36, T41, T43 (medios declarados) y T44 (porcentaje de mascotas). No hizo falta una tarea para la situación fiscal: ya está cargada (Rodrigo, 22/10).

**Fuentes**
- Páginas oficiales de Mercado Libre Argentina, leídas el 21/10 con el navegador integrado y sin iniciar sesión: [Términos del programa](https://www.mercadolibre.com.ar/ayuda/30228), [Obligaciones complementarias](https://www.mercadolibre.com.ar/ayuda/32818), [Cómo calcular tu retribución](https://www.mercadolibre.com.ar/ayuda/27913), [Estados de ventas](https://www.mercadolibre.com.ar/ayuda/56840), [Motivos de suspensión](https://www.mercadolibre.com.ar/ayuda/40039) y [Qué es Afiliados y Creadores](https://www.mercadolibre.com.ar/ayuda/programa-afiliados-creadores_39155).
- Las páginas `/l/…` del portal (pagos, buenas prácticas, cálculo de ganancias) piden iniciar sesión y no se leyeron.
- Guía completa, con fuentes de prensa: doc "Afiliados de Mercado Libre: guía práctica" (https://claude.ai/artifact/K2gNMmmv1KZHJi2K4WcdMc).

### H18 · Lo que dicen los términos y cómo tocan al sitio

**Dato.**
- Atribución: 24 horas corridas desde el clic. Venta directa = el producto recomendado u otro de la misma categoría; indirecta = otra categoría, y paga la mitad.
- Tabla oficial: 8 % directa y 4 % indirecta en 20 categorías (ropa, hogar, juguetes, herramientas, etc.); 4 % y 2 % en electrónica, celulares y computación; 0 % en Alimentos y Bebidas. Animales y Mascotas no figura. El 21/10 el botón de Eukanuba mostró "Ganancia 15 %" (T33). La ayuda oficial dice "hasta el 8 %".
- Cobro: mínimo $ 30.000 de al menos 3 ventas de 3 compradores distintos. Cada venta se valida hasta 60 días desde la entrega. Hay que facturar, y el pago llega dentro de los 30 días de la factura, en Mercado Pago.
- Requisitos: ser monotributista, Responsable Inscripto o IVA Exento; 60 días desde el alta para presentar la documentación fiscal y 30 para validar la identidad en Mercado Pago. Sin eso, suspensión y las ventas del período no cuentan.
- Solo cuentan los medios declarados. Los buscadores (Google, Bing) no son medios.
- Prohibido: editar o modificar los links, acortadores de terceros, comprar con el propio link o desde cuentas vinculadas (mismo celular, wifi, dirección o historial), usar cuentas de familiares, anuncios en buscadores (Google Ads, Shopping, Bing Ads, YouTube Ads), palabras clave con la marca, email publicitario sin permiso escrito, premiar compras, extraer datos de Mercado Libre de forma automatizada e información engañosa.
- La pauta paga solo se permite en Instagram, TikTok, Facebook y Pinterest, desde la cuenta declarada.

**Interpretación.**
- El botón `?partner_id=cbpar_…` de las fichas es un link armado a mano: va contra la regla de no editar links. Hay que reemplazarlo aunque la prueba de la T33 muestre clics.
- La venta de prueba de la T06 no conviene: con un familiar está prohibida, y desde la misma casa se rechaza como cuenta vinculada.
- La experiencia inventada de la guía de arena (T41) además es causa de suspensión ("información falsa").
- *Especulación:* el 15 % de mascotas puede ser una tasa promocional.
- *Opinión:* si Rodrigo no es monotributista, la cuota de la categoría A ($ 49.527 desde agosto de 2026, según Ámbito) hoy supera lo que puede pagar el programa. *Actualización 22/10:* no aplica, porque Rodrigo confirmó que la situación fiscal ya está cargada.

**Pendiente.**
- Rodrigo: confirmar si el panel sigue en modo prueba y que el sitio e Instagram estén declarados como medios (T43). La situación fiscal ya está cargada (22/10).
- Rodrigo: anotar el porcentaje del botón "Ganancia" de los 11 alimentos y las 4 arenas (T44).
- Sumar a la consulta de la T05: qué porcentaje paga Animales y Mascotas (y si es promocional) y si un canal de WhatsApp cuenta como medio (T05).

---

## 2026-10-21 · Etiquetas de seguimiento del panel de afiliados (T10, T11)

Tareas: T10, T11, T16, T17.

**Fuentes**
- Capturas del Administrador de etiquetas que pasó Rodrigo (21/10, 20:11 y 20:12).
- Código: `site/app/page.tsx`, `site/app/guias/[slug]/page.tsx`, `site/app/categoria/[slug]/` y `site/data/productos-curados.ts`.
- Guías de terceros: [GrupoZap](https://grupozap.online/afiliados/mercado-livre) y [Divulga Ninja](https://www.divulganinja.com.br/es/blog/como-criar-link-afiliado-mercado-livre/). La ayuda oficial de Mercado Libre ([Cómo crear etiquetas](https://www.mercadolibre.com.ar/l/primeros-pasos-organiza-tus-links)) no se puede leer de forma automática.
- Producción, revisada el 21/10 con el navegador integrado.

### H17 · La etiqueta se elige al generar el link y no se puede cambiar después

**Dato.**
- El Administrador de etiquetas tenía una sola, `rodrigogilbulacio`, marcada como "Etiqueta en uso". La etiqueta en uso se elige con un botón de opción. La pantalla no muestra los links ni permite cambiarle la etiqueta a uno ya generado.
- Al intentar crear `guia-alimento`, el panel respondió: "Creá la etiqueta sin caracteres especiales como %$&!." El máximo es de 30 caracteres.
- Cada producto curado tiene un solo link (`linkAfiliado`), que se usa en la home, en su categoría y en las guías. Links por ubicación: 31 en la home (8 de perro, 8 de gato y 15 accesorios), 2 en la guía de alimento, 5 en la guía de arena y 103 en las categorías.
- Según las guías de terceros: el generador usa la etiqueta en uso y los términos del programa prohíben editar el link generado. Lo segundo no está confirmado con Mercado Libre.
- *Verificado el 21/10, abriendo los links en el navegador integrado:* cada `meli.la` redirige a `mercadolibre.com.ar/social/rodrigogilbulacio?matt_word=<etiqueta>&matt_tool=33352389&forceInApp=true&ref=…`. La etiqueta viaja en `matt_word`, y `matt_tool` es el mismo en todos los links. El perfil muestra un producto destacado y su botón "Ir a producto" lleva a la publicación o a la página de catálogo.
- Links viejos de la guía de arena (`rodrigogilbulacio`): los 4 primeros llevan al producto correcto, y los 4 son de catálogo: Zootec 30 kg MLA49294007, Catit Vainilla MLA60924254, Zootec 24 kg MLA48897680 y Catit Lavanda MLA27724749. El de Bio Stones (`1PrLE6E`) lleva a "Este perfil está vacío".
- Los 5 links nuevos de la guía de arena tenían `guiaarena`, pero llevaban a otros productos: Rubicat Premium (MLA40696907), Rubicat Classic (MLA40007618), Absorsol (MLA24609240), Sanicat (MLA2042180189) y Zootec Lavanda (MLA57684109). Rodrigo dice que, cuando los abrió después de generarlos, mostraban el producto correcto. Claude los abrió a las 21:38 y mostraban los de la lista. No sabemos por qué no coinciden.
- Los 2 links de la guía de alimento (`2MgKzrC` y `1akqNyn`) llevan a Pro Plan (MLA22146528) y a Eukanuba (MLA13363713), con `matt_word=guiaalimentoperro`.
- La primera vez que Rodrigo generó los 2 links de alimento, salieron con otra etiqueta. Hubo que generarlos de nuevo.

**Interpretación.**
- Para medir una ubicación nueva hay que generar de nuevo todos sus links. En la home serían 31.
- *Opinión:* con el tráfico de hoy (11 clics desde Google en 3 meses), las etiquetas van a mostrar casi cero durante semanas. En los próximos meses hay que decidir dos cosas: si las guías venden (T32, T18) y si vale la pena volver a Instagram (T16). Por eso se etiquetaron solo las guías e Instagram. Si hace falta saber qué ubicación del sitio genera clics, conviene medirlo desde el sitio (T34), sin tocar los links.
- El riesgo principal es de operación: generar links a mano tiene errores. En las dos tandas del 21/10 hubo uno: links de alimento con otra etiqueta y links de arena que llevan a otros productos. Por eso, Claude abre cada link nuevo antes de publicarlo y revisa el producto y la etiqueta. Cuesta un clic por link, que hay que anotar.
- Si uno de los 5 links de arena estaba roto, puede haber más en el catálogo (T42).

**Pendiente.**
- Los 4 links de la guía de arena con `guiaarena`, generados desde las URLs de catálogo de arriba (T11).
- Saber si el panel deja borrar `guiaalimento` y `gualimento`, creadas por error (T10).
- Clics de prueba hechos por Claude el 21/10, que no son visitas: entre las 21:33 y las 21:37, 9 con `rodrigogilbulacio` y 2 con `guiaalimentoperro`; entre las 21:38 y las 21:39, 5 con `guiaarena`. A esto se suman los que hizo Rodrigo desde el celular entre las 21:22 y las 21:30.

**Decisiones (21/10).**
- Etiquetas: `guiaalimentoperro`, `guiaarena` e `instagram`. La home y las categorías se quedan con `rodrigogilbulacio`.
- Cada guía usa sus propios links (`linksEtiquetados` en `site/app/guias/[slug]/page.tsx`). El detalle de los links está en la T11.
- La guía de arena volvió a los links viejos hasta tener los buenos con `guiaarena`. Bio Stones salió del catálogo y de la guía porque su link está roto. Las 4 arenas que quedan guardan su `mlId` (commit `7d4cf3b`).

---

## 2026-10-21 · Guía de alimento para raza grande (T09)

Tareas: T09, T08.

**Fuentes**
- Código: `site/app/guias/[slug]/page.tsx` (texto de la guía y `productosRelacionados`) y `site/data/productos-curados.ts`.
- Search Console, rendimiento de 3 meses (19/7–18/10), tabla de páginas.
- `alimentos-ml.json` (búsqueda del 21/10, H14), copia en la carpeta del proyecto.
- Fichas oficiales argentinas, leídas el 21/10: [Royal Canin Maxi Adult](https://www.royalcanin.com/ar/dogs/products/retail-products/maxi-adult-3007), [Pro Plan Adulto Razas Grandes](https://www.purina.com.ar/proplan/perros/adulto/razas-grandes) y [Excellent Adulto Razas Medianas y Grandes](https://www.purina.com.ar/excellent/perros/adulto-pollo). La de Eukanuba Argentina no se pudo leer.

### H16 · Cambiar las tarjetas no alcanza: la guía y el catálogo no coinciden

**Dato.**
- La guía analiza tres alimentos: Royal Canin Maxi Adult, Pro Plan Large Breed Adult y Eukanuba Large Breed Adult. Debajo, como "Productos aprobados por Osvaldo", muestra un arnés (`col-p-001`), un moisés (`cam-p-001`) y un juguete (`jug-p-001`).
- De esos tres, el catálogo solo tiene Eukanuba Razas Grandes 15 kg (`ali-p-003`, MLA13363713, 36 vendedores). Royal Canin Maxi Adult y Pro Plan Razas Grandes Adulto no aparecieron en las 23 búsquedas de H14. Eso no prueba que no estén en el catálogo de Mercado Libre: cada búsqueda trae 15 resultados.
- Excellent Adulto Razas Medianas y Grandes (`ali-p-001`), según Purina Argentina: los primeros ingredientes son harina de subproductos de pollo, maíz, trigo y arroz; proteína mínima 24 %. La guía dice que hay que buscar "proteína animal como primer ingrediente (pollo, res, cordero — no 'harina de subproductos')".
- Nutrique Large Puppy (`ali-p-005`) es para cachorros. La guía es para adultos.
- Lo que dice la guía, contra las fichas oficiales:
  - Royal Canin Maxi Adult: primer ingrediente maíz, segundo harina de subproductos de pollo; proteína mínima 24 %; perros de 26 a 44 kg. **Correcto.**
  - Pro Plan Adulto Razas Grandes: carne de pollo, arroz y harina de subproductos de pollo ("fuente natural de glucosamina"); proteína mínima 26 %; omega 3 y 6. No menciona EPA. **"Incluye glucosamina y EPA" es inexacto en lo de EPA.**
  - Eukanuba Adulto Razas Grandes: "pollo como primer ingrediente". **Sin verificar** para la fórmula argentina.
  - "Porcentaje de proteína: mínimo 22 % para adultos" no es un estándar. Los tres alimentos verificados declaran entre 24 % y 26 %.
  - "Exceso de calcio acelera el crecimiento y daña las articulaciones" vale para cachorros de raza grande, no para adultos.
- El texto cuenta experiencia propia: "Osvaldo lo aprendió de la manera difícil: un par de marcas genéricas y mucho tiempo en el veterinario. Hoy come solo lo que pasa el corte", y cada marca tiene un "Veredicto de Osvaldo". La guía de arena, a su vez, dice que "Osvaldo cambió de arena cuatro veces".
- La guía dice "Última actualización: junio 2026".
- Search Console, 3 meses: 20 impresiones, posición 7,65, 0 clics.
- *Actualización (búsqueda en el servidor, 21/10 16:06; 3 búsquedas, 41 productos, 19 con vendedores):* Pro Plan Adulto Large Breed 15 kg (MLA22146528) tiene 23 vendedores, con tienda oficial. Hay un duplicado, "Pro Plan Adulto Large 15kg" (MLA21778290), con 4. De Royal Canin Maxi Adult aparecieron la bolsa de 3 kg (MLA43755362, 7 vendedores) y la de 13,6 kg (MLA33116170, 1 vendedor). Ninguna de 15 kg tiene vendedores.
- *Respuestas de Rodrigo (21/10 16:19):* Osvaldo es un perro de tamaño mediano, y la anécdota de las marcas genéricas y el veterinario no es real. En la foto de la publicación de Eukanuba Razas Grandes, el primer ingrediente es carne de pollo.

**Interpretación.**
- Cambiar las tres tarjetas por alimentos cierra la tarea tal como está escrita. Pero si una de las tarjetas es Excellent, la guía muestra como "aprobado" un alimento que no cumple el criterio que ella misma da. Nutrique Puppy tampoco corresponde en una guía de adultos.
- *Opinión:* lo coherente es que las tarjetas sean las tres marcas que la guía analiza.
- *Opinión, después de la búsqueda:* Royal Canin queda sin tarjeta. La bolsa grande tiene un solo vendedor, el mismo riesgo que la ficha de Purina (H13). La de 3 kg tiene menos de 10 vendedores y es una bolsa chica para un perro grande. Además, la propia guía pone a Royal Canin tercera. Las tarjetas quedan en Pro Plan y Eukanuba.
- Las dos anécdotas no pueden ser ciertas a la vez si Osvaldo es una sola mascota: o es un perro grande o usa arena para gatos. Una experiencia inventada en una guía con links de afiliado es un problema con el lector, y además encaja con el riesgo de "afiliación de bajo valor" de H5 (*especulación*: Google no explica cómo lo evalúa).
- Con 20 impresiones en 3 meses, este arreglo no va a traer tráfico. Lo que resuelve es que la guía no contradiga lo que promete, que es el objetivo de la Fase 1.

**Pendiente.**
- Rodrigo: decidir qué productos van en la guía; confirmar si Osvaldo es un perro de raza grande y si la anécdota del veterinario es real; mirar en la bolsa o en las fotos de la publicación si el primer ingrediente de Eukanuba Razas Grandes es pollo.
- Si van las tres marcas: buscar en el servidor los IDs de catálogo de Royal Canin Maxi Adult y Pro Plan Razas Grandes Adulto con vendedores (el script de H14 acepta búsquedas propias) y crear sus `meli.la`.

**Decisiones (21/10).**
- Tarjetas de la guía: Pro Plan Adulto Razas Grandes 15 kg (nuevo `ali-p-007`, MLA22146528, `meli.la/1c5uq7d`) y Eukanuba Razas Grandes 15 kg (`ali-p-003`). Royal Canin queda en el texto, sin tarjeta. Pro Plan también aparece en `/categoria/alimento-perro` y `/categoria/alimentacion`: el catálogo pasa a tener 11 alimentos.
- Se sacó la anécdota del veterinario y "Veredicto de Osvaldo" pasó a "Veredicto". El título de las tarjetas de todas las guías pasó de "Productos aprobados por Osvaldo" a "Los productos de esta guía".
- También se sacaron dos afirmaciones sin fuente: "las marcas más vendidas en Argentina" y "la opción más conocida y más vendida" (Royal Canin).
- Queda la guía de arena, que dice que Osvaldo cambió de arena cuatro veces y tiene un "Veredicto de Osvaldo" (T41).

---

## 2026-10-21 · Alimentos de catálogo en Mercado Libre (T08)

Tareas: T08, T09, T36.

**Fuente.** `site/scripts/buscar-alimentos-ml.mjs` (solo lectura), que Rodrigo corrió en el servidor el 21/10 cerca de las 15:05. Token de la cuenta RODRIGO.GILBULACIO, recién autorizado (T37). 23 búsquedas (marcas comunes y "alimento perro adulto", "gato castrado", etc.), 319 consultas, sin errores ni límites de uso. Detalle completo en `/app/alimentos-ml.json` del servidor.

### H14 · Hay alimentos de catálogo con muchos vendedores

**Dato.** De 295 productos de alimento revisados, 137 tienen al menos un vendedor: 69 aparecen en las búsquedas de perro y 68 en las de gato. Los que más vendedores tienen son Excellent Gato Adulto 7,5 kg (MLA8726956, 69), Eukanuba Perro Adulto Raza Mediana 15 kg (MLA9775933, 50), Excellent Perro Adulto Raza Mediana y Grande 20 kg (MLA15152920, 48) y Eukanuba Perro Adulto Raza Pequeña 15 kg (MLA8726947, 42). Casi todos tienen tienda oficial entre los vendedores.

**Interpretación.**
- Un producto con muchos vendedores tiene menos riesgo de quedar sin ninguno, como le pasó a Purina 22 kg (H13). Por eso conviene elegir los que tienen 10 o más.
- Los precios "desde" (el mínimo entre los vendedores) tienen valores raros. Por ejemplo, Excellent Reduced Calorie 15 kg figura desde $ 20.000, mientras que la bolsa de 3 kg arranca en $ 22.990. No sirven para escribir precios en el sitio.
- La lista de perro o de gato depende de qué búsqueda encontró cada producto, no del producto en sí. Hay errores: Old Prince Gatito y una lata de gato aparecen como perro, y también figura "Leche Royal Canin".
- Muchos de los resultados son dietas veterinarias (Royal Canin Diabetic, Cardiac, Hepatic, Gastrointestinal, Hypoallergenic; Pro Plan NC y OM). Se usan por indicación del veterinario, así que no conviene recomendarlas.

### H15 · Un producto con el ID siguiente al de la ficha de Purina sí tiene vendedores

**Dato.** MLA15152920, "Excellent Perro Adulto Raza Mediana y Grande x 20 kg", tiene 48 vendedores. La ficha con más impresiones del sitio es MLA15152919 (Purina Excellent 22 kg), que no tiene ninguno (H13).

**Interpretación (especulación).** Que los IDs sean consecutivos sugiere que son la misma línea en dos presentaciones. Si es así, la ficha de Purina podría ofrecer la de 20 kg en vez de quedar sin precio.

**Pendiente.** Comparar `/products/MLA15152919` y `/products/MLA15152920` (nombre, marca, línea y `parent_id`). Sirve para la T36.

---

## 2026-10-21 · API de Mercado Libre: qué se puede consultar hoy

Tareas: T28, T29, T36, T37 (nueva), T38 (nueva), T39 (nueva).

**Fuentes**
- Pruebas del 21/10 desde el navegador integrado: la API sin token, 7 fichas `/producto/…` en producción y el buscador (`/buscar?q=arnes`).
- Documentación oficial de Mercado Libre: [Ítems y Búsquedas](https://developers.mercadolibre.com.ar/items-y-busquedas) (actualizada el 10/09/2026), [Autenticación y Autorización](https://developers.mercadolibre.com.ar/es_ar/autenticacion-y-autorizacion) (15/07/2026), [Rate limit / Error 429](https://developers.mercadolibre.com.ar/rate-limit-error-429) y [Permisos funcionales](https://developers.mercadolibre.com.ar/es_ar/permisos-funcionales) (04/03/2026).
- Código: `site/lib/mercadolibre.ts`, `site/app/api/ml-auth/`, `site/app/buscar/page.tsx`, `site/data/productos-curados.ts`, `docker-compose.yml` y el historial de git.
- Las pruebas con token no se pudieron hacer desde acá: la única forma de conseguir un token es renovar el refresh token, que es de un solo uso, y renovarlo afuera del servidor deja al sitio sin token. Quedan para el servidor con `site/scripts/diagnostico-api-ml.mjs` (solo lectura: no renueva el token).

### H8 · Sin token no se puede consultar casi nada

**Dato.** Sin token, `/items`, `/products`, `/products/{id}/items`, `/sites/MLA/search` y `/highlights` devuelven 401 o 403. Solo `/categories` responde.

**Interpretación.** Toda consulta de precio, foto o estado necesita el token de la app. Si el token falla, falla todo lo que dependa de la API.

### H9 · Con token funcionan los productos de catálogo; la búsqueda no

**Dato.**
- El sitio usa la API en dos lugares: las fichas `/producto/[id]` (`/products/{id}` y `/products/{id}/items`) y el buscador `/buscar` (`/sites/MLA/search`). Las funciones de destacados y carruseles (`getHighlights`, `getPetsHighlights` y parecidas) no las usa ninguna página.
- Fichas: de 7 probadas, 6 muestran nombre, fotos y precio (por ejemplo, Eukanuba MLA11212944 a $ 111.871). La de Purina (MLA15152919), la página con más impresiones del sitio, muestra nombre y fotos pero **no muestra precio**: el precio llega en 0, y aun así los datos de producto dicen "en stock".
- El precio de la ficha es el de la primera publicación que devuelve `/products/{id}/items`, no necesariamente la que gana en la página de Mercado Libre. Se actualiza como mucho cada hora.
- Buscador: `/buscar?q=arnes` responde "Osvaldo buscó pero no encontró nada". La búsqueda general de Mercado Libre devuelve 403, y la documentación solo describe búsquedas dentro de las publicaciones de un vendedor; la búsqueda por nickname figura "sin sustitución". El buscador está en la barra de navegación de todas las páginas.

**Interpretación.**
- Para los productos de catálogo (los `/p/MLA…`), la API da precio, fotos y estado.
- No sé si el precio 0 de Purina es porque no hay publicaciones activas o por un error de la API: el código trata igual los dos casos. *Actualización:* no hay vendedores (H13).
- El buscador falla con cualquier búsqueda, y se ve en todas las páginas (T38).

### H10 · El sitio depende de un único refresh token, y el plan B no existe

**Dato.**
- Según la documentación (15/07/2026), el access token dura 6 horas y el refresh token es **de un solo uso**. Además, "cumplido el tiempo de duración del refresh_token (6 meses), expira automáticamente". Los únicos `grant_type` aceptados son `authorization_code` y `refresh_token`.
- Si la renovación falla, `mercadolibre.ts` intenta con `client_credentials`. Según la documentación, ese método no está permitido.
- La autorización de la app (`/api/ml-auth`) se armó entre el 29 y el 30/4/2026 (commits `56746e9`, `25999a8`, `f9efec3` y `e70169c`).
- En el servidor, el token se guarda en `/docker/tiendaosvaldo/site/.ml-token-cache.json`, la carpeta que se monta en el contenedor.

**Interpretación.**
- *Especulación:* la documentación no aclara si los 6 meses se cuentan desde la autorización o desde la última renovación. Si se cuentan desde la autorización, el token vence cerca del **29/10/2026**. Cuando venza, las 106 fichas dan 404 con noindex (H4).
- Volver a autorizar la app reinicia el plazo en los dos casos y lleva un minuto (T37).
- Si la renovación falla, nadie se entera: solo queda en el log del contenedor (T39).

### H11 · Cualquiera puede reemplazar el token del sitio

**Dato.** `/api/ml-auth` es pública. El callback guarda el token de cualquier cuenta que autorice la app, sin comprobar que sea la de Rodrigo, y el sitio lo empieza a usar enseguida.

**Interpretación.** Es poco probable que pase, pero el efecto es grande: si alguien autoriza con su cuenta y después revoca el permiso, las fichas se caen. Se arregla comparando el `user_id` que devuelve Mercado Libre con el de la cuenta del sitio (T39).

### H12 · Los productos curados no se pueden consultar: no guardan el ID de Mercado Libre

**Dato.**
- Los 92 productos de `productos-curados.ts` tienen título, foto, categoría y un link `meli.la`, pero no el ID de Mercado Libre.
- El `meli.la` no lleva a la publicación: lleva al perfil social de afiliado (`mercadolibre.com.ar/social/rodrigogilbulacio`), con el producto destacado arriba. El ID solo aparece en el link de esa tarjeta. Ejemplo: `meli.la/13WNuhc` lleva al Arnés K9, publicación `MLA1960782736` ($ 37.188 el 21/10).
- Ese Arnés K9 es una publicación suelta (`articulo.mercadolibre.com.ar/MLA-…`), no un producto de catálogo. 8 de las 92 fotos son de publicaciones internacionales (CBT). Para publicaciones sueltas, la consulta es `/items/{id}`, que el sitio nunca usó. No está probado que responda con el token de la app para publicaciones de otros vendedores. *Actualización:* responde 403 (H13).
- `/items?ids=` se depreca: hay que usar `/items/bulk?ids=` desde el 25/10/2026. El sitio no usa ninguno de los dos.
- Mercado Libre no publica un límite numérico de consultas: lo controla por aplicación y por endpoint, y pide reintentar con espera ante un error 429.
- Al abrir una publicación desde el navegador, Mercado Libre pidió verificación de cuenta.

**Interpretación.**
- Para revisar los curados (T29), primero hay que guardar el ID de cada uno. Sacarlo del `meli.la` obliga a abrir cada link, y cada apertura probablemente cuenta como un clic en el panel de afiliados (no verificado). El 21/10 hubo 1 clic de prueba en `meli.la/13WNuhc`, hecho por Claude al investigar esto.
- Leer la web de Mercado Libre en lugar de la API no sirve para T29: va contra sus términos y la verificación de cuenta lo vuelve poco confiable.
- *Opinión:* con 92 productos y casi sin tráfico, una publicación pausada cuesta poco. Conviene guardar el ID cada vez que se agrega un producto, empezando por los alimentos de T08, y completar los viejos cuando se revisen, no todos de una vez.

### H13 · Diagnóstico con token en el servidor

**Dato.** Resultado de `diagnostico-api-ml.mjs`, que Rodrigo corrió en el servidor el 21/10 a las 13:38. El token era válido (le quedaban 177 minutos) y es de la cuenta RODRIGO.GILBULACIO.

| Consulta | Respuesta | Qué da |
|---|---|---|
| `/products/{id}` | 200 | Nombre, fotos y estado del producto de catálogo |
| `/products/{id}/items` | 200, o 404 si nadie lo vende | Las publicaciones que venden ese producto, con su precio |
| `/products/search?q=…` | 200 | Búsqueda por palabra dentro del catálogo ("arnes perro": 10.000 resultados) |
| `/items/{id}` | 403 | Nada: las publicaciones de otros vendedores están prohibidas |
| `/items/bulk` e `/items?ids=` | 200, pero 403 en cada publicación | Nada: el mismo bloqueo que `/items/{id}` |
| `/sites/MLA/search` | 403 | Nada |
| `/highlights/…` | 403 | Nada |

- Purina Excellent 22 kg (MLA15152919): el producto está activo, pero `/products/MLA15152919/items` responde 404, "No winners found". Hoy ningún vendedor lo ofrece en esa página de catálogo.
- Eukanuba (MLA11212944): 5 publicaciones, la primera a $ 111.871.
- Mercado Libre no devolvió encabezados con el límite de consultas.

**Interpretación.**
- La API sirve para revisar productos de catálogo: si existen, si alguien los vende y a qué precio. No sirve para publicaciones sueltas de otros vendedores, como el Arnés K9 curado.
- La página con más impresiones del sitio manda a un producto que hoy no vende nadie. Lo más probable es que ese clic no termine en una compra. No se pudo ver qué muestra la página: Mercado Libre pidió verificación de cuenta.
- Confirmado en una segunda prueba (13:42): `/items/bulk` e `/items?ids=` devuelven 403 para cada publicación. No hay ningún camino de la API para leer publicaciones sueltas de otros vendedores.
- Que el token fuera válido a las 13:38 muestra que la renovación automática funciona hoy. Eso no cambia el riesgo del 29/10 (H10).

**Pendiente.**
- Para que T29 pueda revisar un producto curado, el producto tiene que ser de catálogo y hay que guardar su ID de catálogo. Con `/products/search` se pueden buscar esos IDs sin abrir los `meli.la`.
- La prueba de T33 conviene hacerla con una ficha que tenga vendedores, como Eukanuba (MLA11212944), y no con la de Purina.
- Rodrigo puede mirar desde el celular qué muestra `mercadolibre.com.ar/p/MLA15152919`.

### Decisiones y próximos pasos

- T28 pasa a Hecho con el diagnóstico del servidor (H13).
- Se crean T37 (volver a autorizar la app antes del 29/10), T38 (buscador) y T39 (proteger el token y avisar si falla).
- T29 pasa a depender también de que los curados tengan su ID, y solo puede cubrir productos de catálogo (H13).
- La prueba de T33 se hace con Eukanuba (`/producto/MLA11212944`): la ficha de Purina no tiene vendedores.

---

## 2026-10-21 · Search Console: indexación, sitemap y fichas `/producto/`

Tareas: T03 (cerrada), T33, T35 (nueva), T36 (nueva).

**Fuentes**
- Exportaciones de Search Console en `C:\Users\rodri\OneDrive\Documents\Claude\Projects\Tienda Osvaldo\search-console\`:
  - `…-Coverage-2026-10-21.zip`: indexación, resumen y motivos.
  - `…-Coverage-Drilldown-2026-10-21*.zip`: las URLs de cada motivo de no indexación.
  - `…-Indexadas-2026-10-21.zip`: las 144 URLs indexadas, con la fecha de su último rastreo.
  - `…-Performance-on-Search-2026-10-21.zip`: rendimiento de 3 meses (19/7–18/10).
  - `…-Page with productos-…zip` y `…-Page without productos-…zip`: rendimiento de 16 meses (con datos desde el 23/4) con y sin `/producto/`.
  - `…-comparacion x fecha-2026-10-21.zip`: fichas `/producto/`, del 20/7 al 17/8 contra el 21/9 al 18/10, ficha por ficha.
- Capturas que pasó Rodrigo: Sitemaps, Acciones manuales y Prueba de resultados enriquecidos de `/producto/MLA15152919`.
- Código: `site/app/sitemap.ts`, `site/app/producto/[id]/page.tsx`, `site/components/ProductCard/ProductCard.tsx`, `site/components/ProductSchema/ProductSchema.tsx`, `site/lib/mercadolibre.ts` y el historial de git.

### H1 · La indexación está sana

**Dato.** Hay 144 páginas indexadas y 9 sin indexar. El número es estable desde julio (entre 143 y 146 indexadas).

| Motivo | URLs | Qué hacer |
|---|---|---|
| Página con redirección | `http://tiendaosvaldo.com.ar/` | Nada: es la redirección normal de http a https |
| No encontrada (404) | `/&`, `/$` | Nada: son URLs basura |
| Excluida por noindex | `/categoria/paseo` | Nada: la categoría ya no existe |
| Excluida por noindex | `/producto/MLA11212944`, `MLA8726979`, `MLA15982733` | Ver H4 |
| Rastreada, sin indexar | `/producto/MLA11878396`, `MLA9415432` | Es una decisión de Google. Ver H5 |

**Interpretación.** El problema no es que Google no conozca el sitio, sino dónde lo muestra.

### H2 · El sitemap está incompleto y Google no lo lee desde junio

**Dato.**
- Search Console: el sitemap se envió el 9/6/2026, se leyó por última vez ese mismo día, está en estado "Correcto" y descubre 19 páginas.
- `site/app/sitemap.ts` arma esas 19 URLs: 6 páginas fijas, las 11 categorías de `SLUG_CONFIG`, `/guias` y una sola guía (`mejor-alimento-perro-adulto-raza-grande-argentina-2026`).
- Faltan:
  - la guía de arena (`arena-gatos-aglutinante-vs-silice-argentina-2026`), con posición 7,5, la mejor del sitio;
  - las 106 fichas indexadas;
  - 18 categorías indexadas que no están en `SLUG_CONFIG` (por ejemplo `perros-de-raza`, `peces` o `camas-y-cuchas`).
- `lastModified` siempre vale `new Date()`, así que la fecha cambia en cada consulta.

**Interpretación.** No es grave, porque Google encuentra las páginas por los links. La guía de arena, por ejemplo, la encontró desde `/guias`. Pero una fecha que cambia siempre no le sirve a Google para saber qué cambió de verdad.

**Pendiente.** T35: completar el sitemap, poner fechas reales y reenviarlo.

### H3 · Las fichas `/producto/` quedaron sin links internos desde el 9/6

**Dato.**
- El commit `1c60912` ("Bug Fixing", 9/6/2026) cambió `ProductCard`: los links a `/producto/{id}` pasaron a ser links directos de afiliado a Mercado Libre. En `app/` y `components/` no queda ningún link a `/producto/`.
- Las fichas son 106 de las 144 páginas indexadas. En 3 meses sumaron 848 de las 1.545 impresiones de la tabla por página (55 %) y 6 de los 11 clics. Search Console cuenta 1.444 impresiones totales del sitio, porque en el total cada búsqueda se cuenta una vez aunque muestre varias páginas.
- Son un catálogo distinto al curado: se arman con la API de Mercado Libre a partir del ID. Los 92 productos de `productos-curados.ts` no guardan el ID de Mercado Libre, así que no se pueden cruzar.
- Su botón usa `mercadolibre.com.ar/p/{id}?partner_id=…`, no los `meli.la` del resto del sitio (T33).
- Último rastreo de Google, en días hasta el 21/10:

| Páginas | Mediana | Más de 45 días sin rastrear |
|---|---|---|
| Fichas | 42 | 51 de 106 (48 %) |
| Categorías | 25 | 7 de 29 (24 %) |

**Interpretación.** El cambio del 9/6 va en la línea de la decisión 5 de la auditoría: el clic a Mercado Libre tiene que ser el más fácil y la ficha no tiene que ser un paso intermedio. El efecto lateral fue dejar huérfanas las páginas que más aparecen en Google.

### H4 · Si falla la API de Mercado Libre, la ficha sale con noindex

**Dato.**
- Desde el primer commit (10/4), en `site/app/producto/[id]/page.tsx` el `generateMetadata` devuelve `robots: { index: false }` ante cualquier error de la API. La página, en ese caso, devuelve 404.
- Las 3 fichas con noindex (MLA11212944, MLA8726979 y MLA15982733: Eukanuba, Royal Canin y Old Prince) tienen como último rastreo el **29/4/2026**. Ese día hay 7 commits que arreglan el token de Mercado Libre (por ejemplo `25999a8` "se corrigieron los tokens de ml" y `e45b70a` "se soluciono erro de token…").
- El 21/10 las 3 cargan bien, con producto, precio y botón. La ficha de Purina (MLA15152919) también es rastreable e indexable según la Prueba de resultados enriquecidos.
- `site/lib/mercadolibre.ts` hoy renueva el token automáticamente y lo guarda en disco. *Corrección del 21/10:* el método alternativo que usa si la renovación falla (`client_credentials`) Mercado Libre no lo acepta (H10).

**Interpretación.** Casi confirmado: Google rastreó esas 3 fichas justo con el token roto y no volvió. El arreglo del token baja la probabilidad, pero el mecanismo sigue: cualquier otra falla (Mercado Libre caído, exceso de consultas, publicación pausada) deja la ficha con noindex o 404.

**Pendiente.**
- En Search Console, Inspección de URL de las 3 → Probar URL publicada → Solicitar indexación.
- Si las fichas se quedan (T36): poner noindex solo cuando Mercado Libre diga que el producto no existe.

### H5 · Las fichas perdieron cerca del 40 % de sus impresiones desde mediados de agosto

**Dato.** Impresiones de Google, fichas contra el resto del sitio (exportaciones de 16 meses):

| Período | Fichas: impresiones por día | Fichas: posición | Resto: impresiones por día | Resto: posición | Peso de las fichas |
|---|---|---|---|---|---|
| 23/4–8/6 (antes del cambio) | 2,3 | 15,2 | 1,4 | 14,4 | 62 % |
| 9/6–25/7 | 6,7 | 14,6 | 4,1 | 23,7 | 62 % |
| 26/7–9/9 | 11,1 | 12,5 | 7,5 | 24,8 | 60 % |
| 10/9–19/10 | 7,3 | 11,4 | 7,8 | 19,4 | 48 % |

Impresiones por semana de las fichas: 90 (3/8), 89 (10/8), **71 (17/8)**, 78, 72, 71, 66 (14/9), **47 (21/9)**, 46, 57, 42 (12/10). Entre el 3/8–13/9 y el 21/9–18/10, las fichas bajaron 39 % (de 78 a 48 por semana) y el resto del sitio 11 % (de 59 a 52).

Comparación del 20/7–17/8 contra el 21/9–18/10, solo fichas:
- Impresiones: de 303 a 192 (−37 %). Clics: de 2 a 0. Posición media: de 13,9 a 10,7, o sea que mejoró.
- Fragmentos de producto (el resultado de Google con precio y foto): de 103 a 30 impresiones (−71 %).
- 31 fichas pasaron a 0 impresiones y aparecieron 14 nuevas.

Por fecha del último rastreo:

| Último rastreo de Google | Fichas | Impresiones antes → después |
|---|---|---|
| Antes del 18/8 (no las volvió a visitar) | 17 | 81 → 82 |
| Desde el 24/9 (visitadas durante o después del update de septiembre) | 29 | 94 → 64 (−32 %) |

En el primer grupo, la ficha de Purina pesa 50 de las 81 impresiones. Sin ella, las otras 16 pasan de 31 a 39.

Contexto externo: Google lanzó un spam update del 18 al 21/8/2026 y otro del 24/9 al 8/10/2026. En Acciones manuales: "No se ha detectado ningún problema". El repo no tiene commits desde el 21/6, así que en esas fechas no cambió el código.

**Interpretación.**
- *Descartado como causa principal:* la falta de links internos. Si fuera eso, tendrían que perder más las fichas que Google dejó de visitar, y esas se mantuvieron.
- *Hipótesis principal:* en los updates de agosto y septiembre, Google volvió a evaluar las fichas y las muestra en menos búsquedas. Sus políticas de spam incluyen la "afiliación de bajo valor": texto y fotos copiados del vendedor más un link de afiliado. Es la descripción exacta de las fichas.
- Que la posición media mejore es compatible con esto: las fichas que cayeron muy abajo dejan de sumar impresiones, y el promedio queda formado por las que siguen bien.
- Límites: son entre 40 y 90 impresiones por semana, así que hay mucho ruido. Dos coincidencias de fechas no son una prueba, y Google no confirma estas cosas.
- *Riesgo (especulación):* Google evalúa parte de la calidad a nivel de sitio entero, así que 106 páginas copiadas pueden pesar sobre las categorías y las guías.

### H6 · Los datos estructurados de las fichas no funcionan

**Dato.**
- Desde el commit `61681d8` (4/6), los datos de producto (JSON-LD) van dentro de `metadata.other` en `page.tsx`. Next.js los publica como una etiqueta `<meta>`, que Google no lee como datos estructurados.
- El componente `components/ProductSchema/ProductSchema.tsx`, que sí arma un `<script type="application/ld+json">`, no se usa en ninguna página.
- Antes del 4/6 no había datos de producto.
- Los datos declaran `seller: Tienda Osvaldo` y `availability: InStock` siempre. Las dos cosas son falsas: el que vende es Mercado Libre y el stock no se consulta.
- Prueba de resultados enriquecidos (21/10, MLA15152919): "No se ha detectado ningún elemento".

**Interpretación.** Los fragmentos de producto que Google mostraba en julio y agosto los armaba por su cuenta, a partir de lo que se ve en la página. Google no explica de dónde los saca, así que esto no es seguro.

**Pendiente.** Solo si las fichas se quedan (T36): usar un JSON-LD real y que describa la ficha como lo que es, una ficha con link a Mercado Libre y no una tienda que vende.

### H7 · Pocas fichas concentran casi todo

**Dato.** Del total de impresiones de las fichas en 3 meses, 5 fichas suman el 43 %, 10 el 55 % y 20 el 68 %. Las 10 primeras, con sus impresiones: MLA15152919 (Purina Excellent 22 kg, 183), MLA24118864 (65), MLA8726953 (59), MLA61059039 (35), MLA15233904 (26), MLA18595243 (23), MLA20995296 (22), MLA10255763 (19), MLA11922115 (17) y MLA9415432 (16).

**Interpretación.** Si las fichas se quedan, conviene dar contenido propio solo a esas 10. Con 106 no hay forma de hacerlo con 1 o 2 horas por mes.

### Decisiones y próximos pasos

- T03 pasa a Hecho. Se crean la T35 (sitemap) y la T36 (qué hacer con las fichas).
- **Lo próximo, la T33:** hacer clic en el botón de compra de `/producto/MLA15152919` y al día siguiente revisar si el clic aparece en el panel de afiliados. *Actualización 21/10:* hacerla con `/producto/MLA11212944` (Eukanuba), porque Purina no tiene vendedores (H13).
- Opciones para la T36, que dependen del resultado de la T33:
  - **Si comisionan:** corregir los datos estructurados y el noindex por error de la API, y dar contenido propio a las 10 fichas principales (opinión de Rodrigo sobre el producto y foto de Osvaldo si lo usa). Enlazarlas tal como están no alcanza.
  - **Si no comisionan:** sacarlas del índice o redirigirlas a la categoría que corresponda.

Fuentes externas:
- [August 2026 spam update — Momentic](https://momenticmarketing.com/google-updates/august-2026-spam-update)
- [September 2026 spam update — Momentic](https://momenticmarketing.com/google-updates/september-2026-spam-update)
- [Google Confirms August 2026 Spam Update Is Complete — Let's Data Science](https://letsdatascience.com/news/reports-link-google-spam-update-to-seo-ai-content-f68af1af)

---

## Antes del 21/10 · Hallazgos de la auditoría (resumen)

El detalle está en el documento de auditoría del proyecto de Claude, `auditoria-y-rediseno-2026-10.md`.

- **Links de afiliado (T01).** Los `meli.la` abren siempre la app de Mercado Libre en el celular (verificado por Rodrigo el 21/10). No está confirmado si la compra dentro de la app se atribuye (T05).
- **Panel de afiliados (T04).** Del 14 al 20/10 hubo 0 clics y 0 ventas. La semana anterior sí hubo actividad. Rodrigo dejó de publicar en Instagram por cambio de prioridades.
- **Analytics (T02, T34).** 4 usuarios en 90 días, 3 de Google orgánico. Es un piso: con el consent mode, las visitas solo se cuentan si la persona acepta las cookies.
- **Catálogo (T08, T09).** `site/data/productos-curados.ts` tiene 92 productos y ningún alimento. Por eso `/categoria/alimentacion`, `/alimento-perro` y `/alimento-gato` están vacías, y el botón principal de la home lleva a una de ellas (T07). La guía de alimento para raza grande recomienda un arnés, un moisés y un juguete.
- **Contenido (T14).** Leyendo el sitio desde afuera, el cuerpo de las guías no aparecía en el HTML. Falta verificarlo.
- **Detalles (T12, T13).** Todos los productos tienen el cartel "Nuevo". "Collares y correas" y "Collares y arneses" son la misma categoría con dos nombres.
- **Búsquedas (T32).** Paseo y antitirones es el tema con más impresiones, pero en posición ~44. Arena para gatos aparece cerca de la posición 12, con muchas búsquedas de precio. `/categoria/arena-gato` tiene 125 impresiones en posición 20,6 y 0 clics.
- **Automatización (T27, T31).** El workflow de n8n está armado en el repo, pero n8n no está instalado: el `docker-compose.yml` solo levanta el sitio.
