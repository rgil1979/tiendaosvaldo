// Guías del sitio. Una sola fuente para la página de cada guía, el índice /guias y el sitemap.
//
// Al editar una guía, actualizá `actualizado` (fecha real del cambio, AAAA-MM-DD): el sitemap
// la usa como fecha de modificación y Google la toma en cuenta solo si es confiable (T35).
//
// Reglas del programa de afiliados (H18): nada de experiencias inventadas ni información falsa.
// Todo dato tiene que salir de una fuente citada o de la ficha del producto.

export interface Guia {
  /** Título visible (H1 y tarjeta del índice). */
  titulo: string
  /** Título para Google (etiqueta <title>), sin el sufijo de la marca. Si falta, se usa `titulo` + marca. */
  tituloSeo?: string
  /** Descripción para Google y bajada visible debajo del título. */
  descripcion: string
  emoji: string
  /** Fecha del último cambio real del contenido (AAAA-MM-DD). */
  actualizado: string
  contenido: string
  productosRelacionados: string[]
  // Links generados en el panel de afiliados con la etiqueta de esta guía (T10, T11),
  // para saber qué clics y ventas salen de cada guía. Clave: id del producto curado.
  // Si un producto no figura acá, la tarjeta usa su link de productos-curados.ts
  // (etiqueta rodrigogilbulacio). Un producto nuevo en una guía necesita su propio
  // link, generado con la etiqueta de la guía en uso.
  linksEtiquetados?: Record<string, string>
}

export const GUIAS: Record<string, Guia> = {
  "mejor-alimento-perro-adulto-raza-grande-argentina-2026": {
    titulo: "Mejor alimento perro adulto raza grande Argentina 2026",
    descripcion: "Comparamos Royal Canin Maxi Adult, Pro Plan Razas Grandes y Eukanuba Razas Grandes: qué tiene cada uno en la etiqueta y cuál conviene.",
    emoji: "🐕",
    actualizado: "2026-10-21",
    productosRelacionados: ["ali-p-007", "ali-p-003"],
    // Etiqueta guiaalimentoperro
    linksEtiquetados: {
      "ali-p-007": "https://meli.la/2MgKzrC", // Pro Plan Adulto Razas Grandes 15 kg
      "ali-p-003": "https://meli.la/1akqNyn", // Eukanuba Razas Grandes 15 kg
    },
    contenido: `
## Por qué el alimento importa más de lo que pensás

Los perros de raza grande tienen necesidades nutricionales específicas que los diferencian del resto. Su desarrollo óseo, la salud articular y el control del peso corporal dependen directamente de la calidad del alimento que reciben.

## Qué mirar en la etiqueta (y qué ignorar)

**Lo que importa:**
- Proteína animal como primer ingrediente (pollo, res, cordero — no "harina de subproductos")
- Porcentaje de proteína: en la etiqueta figura como "proteína bruta (mín.)". En los alimentos premium para razas grandes suele estar entre 24% y 26%
- Glucosamina y condroitina para articulaciones (crítico en razas grandes)
- Calcio y fósforo balanceados: es clave sobre todo en cachorros de raza grande, porque el exceso de calcio durante el crecimiento daña las articulaciones

**Lo que podés ignorar:**
- "Natural", "premium", "gourmet" — no tienen definición legal en Argentina
- Colores del packaging — no dice nada sobre la calidad

## Las tres marcas, una por una

### Royal Canin Maxi Adult
Formulada para perros adultos de raza grande, de 26 a 44 kg.

**Lo bueno:** croqueta grande que obliga a masticar despacio, fórmula probada durante años, fácil de conseguir en todo el país.

**Lo no tan bueno:** precio alto y el primer ingrediente es maíz, no proteína animal. Para muchos perros funciona bien igual, pero hay opciones con mejor composición al mismo precio.

**Veredicto:** ✅ Confiable. No la más eficiente en costo-beneficio, pero no falla.

### Pro Plan Large Breed Adult
Carne de pollo como primer ingrediente. Incluye harina de subproductos de pollo, fuente natural de glucosamina, y ácidos grasos omega 3 y 6.

**Lo bueno:** mejor perfil nutricional que Royal Canin en papel, proteína animal al frente, omega-3 incluido.

**Lo no tan bueno:** precio similar a Royal Canin, disponibilidad variable según la región.

**Veredicto:** ✅ La mejor relación composición/precio del segmento premium.

### Eukanuba Large Breed Adult
Menos conocida pero sólida. Carne de pollo como primer ingrediente, tecnología de control de sarro dental.

**Lo bueno:** composición honesta, precio levemente inferior a las dos anteriores.

**Lo no tan bueno:** distribución más limitada — no siempre está en todos los pet shops.

**Veredicto:** ✅ Buena opción si la conseguís cerca.

## ¿Cuánto debería comer un perro grande?

La respuesta honesta: depende del peso, la actividad y el metabolismo de tu perro. Las tablas del envase son un punto de partida, no una regla.

Regla práctica: si podés palpar las costillas sin presionar pero no las ves, el peso está bien. Si tenés que presionar fuerte, está excedido.

## Dónde comprar en Argentina

Todas las marcas de esta guía están disponibles en Mercado Libre con envío a todo el país. Los precios varían constantemente — siempre revisá el precio actual antes de comprar.

## Fuentes

- [Royal Canin Maxi Adult — Ficha técnica oficial Argentina](https://www.royalcanin.com/ar/dogs/products/retail-products/maxi-adult-3007)
- [Pro Plan Adult Large Breed — Sitio oficial Purina Argentina](https://www.purina.com.ar/proplan/perros/adulto/razas-grandes)
- [Ingredientes Pro Plan Large Breed (distribuidor certificado)](https://www.etra.com.ar/super-premium-perro/403-pro-plan-adult-large-breed-x-3-kg.html)

---

*Esta guía está basada en las fichas técnicas oficiales de cada marca y no reemplaza la consulta con un médico veterinario. Los precios varían constantemente — siempre verificá el precio actual en Mercado Libre antes de comprar. Última actualización: octubre 2026.*
    `,
  },
  "arena-gatos-aglutinante-vs-silice-argentina-2026": {
    titulo: "Arena para gatos: aglutinante o sílice, cuál conviene",
    // T32: las búsquedas donde la guía aparece cerca de la posición 8 son de compra
    // ("bolsa de arena para gatos", "cuánto sale la arena para gatos").
    tituloSeo: "Arena para gatos: qué bolsa comprar, ¿aglutinante o sílice?",
    descripcion: "Qué arena para gatos comprar según cuántos gatos tenés: aglutinante o sílice, cuál rinde más, polvo, olor y qué prefieren los gatos. Con bolsas de 5 a 7 kg.",
    emoji: "🐈",
    actualizado: "2026-10-23",
    // T41: las cuatro son aglutinantes sin fragancia, para que los productos no contradigan
    // la guía (la mayoría de los gatos prefiere arena sin perfume).
    productosRelacionados: ["are-g-006", "are-g-007", "are-g-008", "are-g-009"],
    // Etiqueta guiaarena (T11), generados el 22/10.
    linksEtiquetados: {
      "are-g-006": "https://meli.la/2RNfu4s", // Rubicat Classic 5,3 kg
      "are-g-007": "https://meli.la/14FE2HB", // Sanicat Strong Clumps 7 kg
      "are-g-008": "https://meli.la/2CfLr4C", // Catit Go Natural Sin Aromas 5,6 kg
      "are-g-009": "https://meli.la/2MvPbtH", // Rubicat Sensitive Microesferas 5 kg
    },
    contenido: `
## Por qué conviene elegir bien

Vas a limpiar el arenero todos los días durante años, así que el tipo de arena define cuánto trabajo te lleva, cuánto gastás por mes y si tu gato usa el arenero sin problemas. Aglutinante y sílice resuelven problemas distintos: elegir solo por precio puede terminar en más limpieza o en una arena que el gato no quiere usar.

## Aglutinante vs sílice: qué es cada una

**Arena aglutinante:** al contacto con la orina forma una bola compacta que se levanta entera con la pala. La mayoría es de bentonita, una arcilla, y también hay aglutinantes biodegradables, como la Catit Go Natural de esta guía, hecha con cáscara de arveja. En Mercado Libre se consiguen marcas como Rubicat, Sanicat, Absorsol, Zootec y Catit. Sacás las bolas y los sólidos, y reponés solo lo que falta.

**Arena de sílice (cristales):** no forma bolas: el cristal absorbe la orina. Los sólidos se sacan todos los días y, cuando los cristales se saturan, se cambia toda la carga. Los fabricantes hablan de hasta 30 días con un solo gato (PetSafe, para su bandeja de cristales); con más gatos dura menos.

## Comparación directa

- **Limpieza diaria:** con la aglutinante sacás todos los días las bolas de orina y los sólidos; con la sílice, solo los sólidos.
- **Polvo:** la aglutinante de bentonita levanta polvo al verterla y al pisarla; la sílice suele levantar menos. Importa si alguien en tu casa tiene problemas respiratorios.
- **Olor:** la sílice retiene el olor de la orina dentro del cristal; con la aglutinante, el olor depende de qué tan seguido limpies.
- **Peso y rastro:** la aglutinante pesa más y se pega más a las patas; la sílice es más liviana, pero los cristales también se esparcen.
- **Costo por mes:** la aglutinante suele ser más barata por kilo; la sílice cuesta más por bolsa, pero con un solo gato se cambia menos seguido. El costo real depende de cuántos gatos tenés, no del precio de la bolsa.
- **Varios gatos:** con dos o más, la sílice se satura mucho más rápido y deja de convenir. Ahí gana la aglutinante.

## Lo que prefieren los gatos

Si el gato no quiere usar la arena, nada de lo anterior sirve. Según los estudios que resume Fear Free (en un artículo revisado por un veterinario especialista en conducta), la mayoría de los gatos prefiere una arena sin perfume, suave y de grano fino, y prefiere la aglutinante: lo que buscan es no pisar arena mojada. En un estudio que comparó pellets de madera, sílice y arcilla, la mayoría eligió sílice o arcilla antes que los pellets, y entre esas dos, arcilla, sobre todo para defecar. Son preferencias de la mayoría: tu gato puede ser distinto.

## ¿Cuál conviene según tu situación?

- **Tenés un solo gato y querés limpiar menos:** sílice, siempre que tu gato la acepte.
- **Tenés dos o más gatos:** aglutinante. La sílice se gasta demasiado rápido y termina saliendo más cara.
- **Alguien en tu casa tiene alergias o problemas respiratorios:** sílice, por el polvo.
- **Estás ajustado de presupuesto y podés limpiar todos los días:** aglutinante.
- **Tu gato es mayor o tiene antecedentes urinarios:** ninguna arena reemplaza el control veterinario, pero con la aglutinante ves el tamaño y la cantidad de las bolas de orina, y un cambio brusco es motivo para consultar. Con la sílice es más difícil de notar.

## Errores comunes

- **Mezclar aglutinante y sílice en el mismo arenero:** ninguna de las dos funciona bien.
- **Cambiar de arena de un día para el otro:** a muchos gatos no les gusta la textura nueva y dejan de usar el arenero. Para cambiar, poné un segundo arenero con la arena nueva al lado del de siempre y sacá el viejo cuando el gato ya use el nuevo.
- **Usar arena perfumada si el gato empieza a hacer fuera del arenero:** probá una sin perfume.
- **Comprar la más barata sin mirar de qué está hecha:** una aglutinante que no compacta bien se gasta más rápido y puede terminar saliendo más cara.

## Veredicto

- ✅ Un gato y te importa más el olor que el precio: sílice, si tu gato la acepta.
- ✅ Dos o más gatos, o presupuesto ajustado: aglutinante.
- ✅ Si no sabés qué prefiere tu gato: empezá por una aglutinante sin perfume y de grano fino, que es lo que elige la mayoría.

## Dónde comprar en Argentina

Las cuatro arenas de esta guía son aglutinantes y, según los datos de cada producto en Mercado Libre, sin fragancia: Rubicat Classic (5,3 kg), Sanicat Strong Clumps (7 kg), Rubicat Sensitive Microesferas (5 kg) y Catit Go Natural Sin Aromas (5,6 kg), la biodegradable. Están en Mercado Libre. El precio y el envío cambian según el vendedor: confirmalos antes de comprar.

## Fuentes

- [Cat Litter Science: Why to Let Your Cat Choose — Fear Free Happy Homes](https://www.fearfreehappyhomes.com/cat-litter-science-why-to-let-your-cat-choose/)
- [Bandeja del arenero desechable para arena de cristal ScoopFree — PetSafe](https://www.petsafe.com/es/p/bandeja-del-arenero-desechable-para-arena-de-cristal-scoopfree/PAC10-18162/)

---

*Esta guía se basa en las fuentes citadas y en los datos de cada producto en Mercado Libre, y no reemplaza la consulta con un médico veterinario. Última actualización: octubre 2026.*
    `,
  },
}
