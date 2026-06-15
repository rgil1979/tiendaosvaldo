export type ProductoCurado = {
  id: string
  titulo: string
  imagen: string
  categoria: string
  linkAfiliado: string
  mascota: "perro" | "gato"
}

export const CATEGORIA_SLUGS: Record<string, string> = {
  "Collares / arnese": "collares",
  "Camas":             "camas",
  "Juguetes":          "juguetes",
  "Accesorios":        "accesorios",
}

export const productosCurados: ProductoCurado[] = [

  // ─── Collares / Arneses Perros ───────────────────────────────────────────
  { id: "col-p-001", titulo: "Arnes K9 Pretal Anti Tirones + Correa 3m + Collar K9 Perro", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_644396-MLA88781852488_082025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/13WNuhc", mascota: "perro" },
  { id: "col-p-002", titulo: "Pretal Arnés Para Perro Antiescape Antitirones Regulable", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_914059-MLA108551288285_032026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1agRGhj", mascota: "perro" },
  { id: "col-p-003", titulo: "Arnes Pechera Pitbull Razas Fuertes Reforzado Ajustable", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_960919-MLA102680184743_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2kgsUeS", mascota: "perro" },
  { id: "col-p-004", titulo: "Collar Arnes Pretal Perro Y Gato Con Correa Anti Tirones", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_742310-MLA100875190483_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/13aESqG", mascota: "perro" },
  { id: "col-p-005", titulo: "Pechera Arnés Reforzada Con Correa Para Perro Mediano", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_878044-MLA103584050766_012026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2bqJhCN", mascota: "perro" },
  { id: "col-p-006", titulo: "Pretal Arnés Para Perros Y Gatos Reforzado Doble Costura Color Camuflado Rosa Talle Del Arnés L", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_756565-MLA110240668664_052026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2J23bWp", mascota: "perro" },
  { id: "col-p-007", titulo: "Arnés H Paseo Viajes Anti-tirón Regulable Doble Enganche", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_783874-MLA89166268127_082025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/15bvtLs", mascota: "perro" },
  { id: "col-p-008", titulo: "Arnés Falda H Collar Gato Perro Con Correa Y Moño", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_612295-CBT89096379539_082025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1ZBpESg", mascota: "gato" },
  { id: "col-p-009", titulo: "Arnés Y Correa Para Gatos A Prueba De Escape, Paquete De 2", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_860355-CBT111033262654_052026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/23HXf2g", mascota: "gato" },
  { id: "col-p-010", titulo: "Arnés Antitirones Para Perro Con Anilla Frontal Acolchada", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_812571-CBT109728406444_042026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1xqPkeL", mascota: "perro" },
  { id: "col-p-011", titulo: "Arnes Pretal Para Perro Y Gato Con Correa 1.5 M Anti Tirones", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_688732-MLA90159736164_082025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1dnirQU", mascota: "perro" },
  { id: "col-p-012", titulo: "Kit Paseo Perros Arnés Anti Tirón Collar Correa Porta Bolsa", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_833874-MLA108810905102_032026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2FfLRoh", mascota: "perro" },
  { id: "col-p-013", titulo: "Combo Canny Collar + Correa Perro Arnes Pretal Adiestramient", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_669484-MLA97119260436_112025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1fEgnE5", mascota: "perro" },

  // ─── Collares / Arneses Gatos ────────────────────────────────────────────
  { id: "col-g-001", titulo: "Arnés Y Correa Para Gatos, Ajustable Anti-escape", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_630118-CBT93784316798_102025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2P5VuPs", mascota: "gato" },
  { id: "col-g-002", titulo: "Collar Para Gatos Rastreable para Airtag y mototag Regulable Reflectivo Color Negro Liso", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828605-MLA100111327515_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1BTZxb6", mascota: "gato" },
  { id: "col-g-003", titulo: "Pechera Arnés Transpirable Cómodo Con Correa Para Perro Gato", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_956157-MLM96083638050_102025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1XpptKF", mascota: "gato" },
  { id: "col-g-004", titulo: "Arnés Para Gato Con Gps Bolsillo Naranja Chico Escape Segur", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_952385-MLA102099861349_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1Hk8nfm", mascota: "gato" },
  { id: "col-g-005", titulo: "Collar Ecthol Antipulgas Para Gatos Holliday", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_824678-MLA108475142290_032026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/132Whfp", mascota: "gato" },
  { id: "col-g-006", titulo: "Collar Rastreador Gps Para Gato Compatible Con Ios", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_888773-CBT109534453800_042026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2tqZRbG", mascota: "gato" },
  { id: "col-g-007", titulo: "Arnes Pretal Para Perro Y Gato Con Correa 1.5 M Anti Tirones", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_727127-MLA102415152516_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2m7ezsN", mascota: "gato" },
  { id: "col-g-008", titulo: "Arnes Pretal Gato Trixie Suave Ajustable + Correa Elastica", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_601666-MLA92790298160_092025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1PrrPi3", mascota: "gato" },
  { id: "col-g-009", titulo: "Collar Pretal Arnes Con Correa Premium Perros Gatos", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_925865-MLA82127136415_012025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1UgnRhY", mascota: "gato" },
  { id: "col-g-010", titulo: "Arnés Antiescape Ajustable Para Gatos 150 Cm", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_663805-CBT92741501516_092025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/16ujS1v", mascota: "gato" },
  { id: "col-g-011", titulo: "Conjunto Collar Arnes Para Gatos Extensible Reyes Y Reinas", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_660666-MLA111078912635_042026-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/1yjJ99k", mascota: "gato" },
  { id: "col-g-012", titulo: "Arnés Y Correa Retráctil Para Gato Gris Xs", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_712774-MLA102824102873_122025-F.webp", categoria: "collares", linkAfiliado: "https://meli.la/2BndTrC", mascota: "gato" },

  // ─── Camas Perros ────────────────────────────────────────────────────────
  { id: "cam-p-001", titulo: "Moises Para Perro Alaska Grande", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_730148-MLA112248777189_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2wGeNon", mascota: "perro" },
  { id: "cam-p-002", titulo: "Cama Para Perro Grande Colchoneta Antidesgarro", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_736352-MLA93388722933_092025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2g5hMaP", mascota: "perro" },
  { id: "cam-p-003", titulo: "Cama Moisés Nido Nórdico Antiestrés Funda 60cm Perro Gato", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_671055-MLA110413745174_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/22ZDBTY", mascota: "perro" },
  { id: "cam-p-004", titulo: "Cama Para Perro Y Gato Anti Desgarro Y Antideslizante", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_685480-MLA89883965418_082025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2JEz7Vb", mascota: "perro" },
  { id: "cam-p-005", titulo: "Cama Perro Grande Antiestres Corderito 100cm De Diametro", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_766847-MLA109237297056_042026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2N2FRnj", mascota: "perro" },
  { id: "cam-p-006", titulo: "Colchón Cama Peludita Invierno Perro Donidog Mascota Pet Xxl", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_911191-MLA110688987770_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1bvxsqu", mascota: "perro" },
  { id: "cam-p-007", titulo: "Cama Para Perros Antiestres Comfypetys Comfybed Talla Xl Gris Oscuro Piel Sintetica", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_842847-MLA107947546204_032026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1AegVHX", mascota: "perro" },
  { id: "cam-p-008", titulo: "Moisés Cama Nido Mascotas Perro Gato 4 Colores Chico", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_873750-MLA81656461176_012025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1gfEDgW", mascota: "perro" },
  { id: "cam-p-009", titulo: "Pack Moises Para Perro Alaska + Manta Lola Pets", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_708833-MLA111276475381_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2KioaEi", mascota: "perro" },
  { id: "cam-p-010", titulo: "Cama Moisés Nido Nórdico Antiestrés 80cm Cierre Perro Gato", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_689434-MLA110468239012_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2QqJ3zE", mascota: "perro" },

  // ─── Camas Gatos ─────────────────────────────────────────────────────────
  { id: "cam-g-001", titulo: "2x Saco Cama Mascotas Cueva Polar Soft Abrigado Cucha 45x55", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_807224-MLA111360722788_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1kX5n3g", mascota: "gato" },
  { id: "cam-g-002", titulo: "Cama Bolsa Dormir Mascotas 4 En 1 Corderito Reversible 70x50", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_914323-MLA109566255224_042026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2R32PMM", mascota: "gato" },
  { id: "cam-g-003", titulo: "Cama Cueva Bolsa De Dormir Gatos Perros Reversible Calurosa", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_996293-MLA112754787711_062026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1BynzqJ", mascota: "gato" },
  { id: "cam-g-004", titulo: "Casita Cama Cucha Iglú Para Mascotas Pequeñas Medianas", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_750954-MLA95950709679_102025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1VCMUFi", mascota: "gato" },
  { id: "cam-g-005", titulo: "Cama Terapéutica Para Gatos Ansiedad Anti Estrés Saco Polar", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_915946-MLA111998563031_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2d7q3CN", mascota: "gato" },
  { id: "cam-g-006", titulo: "Cama Cueva Para Gato Con Juguete Colgante", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_748223-CBT106240105822_022026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1fiMShQ", mascota: "gato" },
  { id: "cam-g-007", titulo: "Cama Colgante Gatos Waggs Hamaca Madera Reforzada Y Metal Gris Liso", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_967110-MLA105583309174_012026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2XnpSeQ", mascota: "gato" },
  { id: "cam-g-008", titulo: "Cama Iglú Pompón Gato Cálida Suave Invierno Antiestres", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_914419-MLA87961616873_072025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/1muY8Xx", mascota: "gato" },
  { id: "cam-g-009", titulo: "Cama Casa Cucha Para Mascotas Orejitas Peluche Perro Gato", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_780163-MLA101774567576_122025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/28bjupi", mascota: "gato" },
  { id: "cam-g-010", titulo: "Cama Moises Para Gato Lola Pets Alaska Mediano", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_897449-MLA92381076964_092025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2nmorRm", mascota: "gato" },
  { id: "cam-g-011", titulo: "Cama Para Gatos Cucha Cama Donut Grande Cerrado Resistente", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_885047-MLA111551421643_052026-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2XCH2DU", mascota: "gato" },
  { id: "cam-g-012", titulo: "Cama Tunel Para Gatos Interactivo Plegable 84 Cm", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_760805-MLA95328690161_102025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/2TEnQ3x", mascota: "gato" },
  { id: "cam-g-013", titulo: "Cama Colgante Para Gato Waggs Con Ventosas De Alta Succión", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_672519-MLA97417370262_112025-F.webp", categoria: "camas", linkAfiliado: "https://meli.la/31M1th5", mascota: "gato" },

  // ─── Juguetes Perros ─────────────────────────────────────────────────────
  { id: "jug-p-001", titulo: "Juguete Para Perro Premium Gigwi Suppa Puppa Dino Squeaker", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_692801-MLA50175920355_062022-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1oVEeDr", mascota: "perro" },
  { id: "jug-p-002", titulo: "Alfombra Olfativa Perros Gatos Juguete Interactivo 75x50cm", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_791713-MLA90030482913_082025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1yh6RpL", mascota: "perro" },
  { id: "jug-p-003", titulo: "Juguete Para Perros Peluche Con Chifle Sonido Mordible", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828574-MLA82248726103_022025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1FSg9Do", mascota: "perro" },
  { id: "jug-p-004", titulo: "Juguete Perros Entrenamiento Resistente Aro Mordillo", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_627649-MLA81872425368_012025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1GWHqRh", mascota: "perro" },
  { id: "jug-p-005", titulo: "Juguete Para Perros Mordillo Soga 5 Nudos", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_777676-MLA89834002746_082025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1hAzYnP", mascota: "perro" },
  { id: "jug-p-006", titulo: "Juguete Mancuerna Para Perros Original Ultra Resistente", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_931165-MLA107188024783_022026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2T4Zane", mascota: "perro" },
  { id: "jug-p-007", titulo: "Alfombra Olfativa Perros Y Gatos Alimentación Lenta", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_967478-MLA95401141314_102025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/272t7Zn", mascota: "perro" },
  { id: "jug-p-008", titulo: "Oh Treat Tumble Large Juguete Interactivo Para Perros", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_854142-MLA89825532354_082025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1P7CG5b", mascota: "perro" },
  { id: "jug-p-009", titulo: "Juguete Para Perros Mordillo Pelota Soga Gde 8cm Anti Stress", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_826436-MLA74592504310_022024-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2DUeR4W", mascota: "perro" },
  { id: "jug-p-010", titulo: "Alfombra Olfativa Para Perros Juguete Interactivo Premium", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_979975-MLA92248194730_092025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1txWW2K", mascota: "perro" },
  { id: "jug-p-011", titulo: "Pileta Piscina Estructural Plegable Lona Para Perros Mascota", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_736344-MLA81918598740_012025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2btUSdv", mascota: "perro" },

  // ─── Juguetes Gatos ──────────────────────────────────────────────────────
  { id: "jug-g-001", titulo: "Juguete Para Gato Pelota Interactiva Con Cuerda Antiansiedad", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_631744-MLA90029189521_082025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1vgncGZ", mascota: "gato" },
  { id: "jug-g-002", titulo: "Juguete Interactivo Para Gatos Cañita Giratoria Funloop", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_921921-MLA112692218233_062026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2QhuUhg", mascota: "gato" },
  { id: "jug-g-003", titulo: "Juguete Interactivo Varita Retractil Laser Autom. Para Gato", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_680983-MLA99977022166_122025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2gFiuXJ", mascota: "gato" },
  { id: "jug-g-004", titulo: "Juguete Interactivo Rascador De Cartón Para Gato Con Bola", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_801102-CBT109511775395_032026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2pvreau", mascota: "gato" },
  { id: "jug-g-005", titulo: "Rueda Correr Ejercicio Para Gatos Color Marrón Claro", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_956386-MLA95404934186_102025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2MhyFSC", mascota: "gato" },
  { id: "jug-g-006", titulo: "Cañita Telescópica - Juguete Varita - Kit Con 7 Accesorios", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_769963-MLA110684310780_052026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1KpQ4Gh", mascota: "gato" },
  { id: "jug-g-007", titulo: "Juguete Ratón Interactivo Beepaw Para Gatos Con Control Color Azul", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_962343-MLA99451177212_112025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/238cpf9", mascota: "gato" },
  { id: "jug-g-008", titulo: "Juguete Gato Mascota Interactivo Recargable Automático", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_967427-MLA94067265235_102025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2pNRCny", mascota: "gato" },
  { id: "jug-g-009", titulo: "Laberinto De Juguete Tunel De Tela Para Mascotas Hogar", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_987882-MLA93859555984_102025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1B69hEk", mascota: "gato" },
  { id: "jug-g-010", titulo: "Juguete Para Gatos Beepaw Wand-e Vara Telescopica Con Laser Color Celeste", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_901976-MLA99444575204_112025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2HcCBz5", mascota: "gato" },
  { id: "jug-g-011", titulo: "Juguete Para Gato Pelota Interactiva Anti Ansiedad A Batería", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_927694-MLA96269232475_102025-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2eeH7HG", mascota: "gato" },
  { id: "jug-g-012", titulo: "Pelota Interactiva Pet Gravity Recargable y Automática para Gatos", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_857712-MLA104449382868_012026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/2mwdQdz", mascota: "gato" },
  { id: "jug-g-013", titulo: "Rueda De Ejercicios Para Gatos Amunì Silenciosa + Juguete", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_933574-MLA110739226280_052026-F.webp", categoria: "juguetes", linkAfiliado: "https://meli.la/1w9SE8w", mascota: "gato" },

  // ─── Accesorios Perros ───────────────────────────────────────────────────
  { id: "acc-p-001", titulo: "Rampa Para Perros Plegable Doble Refuerzo Antideslizante", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_885957-MLA81514858552_012025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/29XMXx8", mascota: "perro" },
  { id: "acc-p-002", titulo: "Colchon Impermeable C/ Funda Lyon Pet 70x50 Razas Chicas", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_855355-MLA89715431857_082025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/27WL4WN", mascota: "perro" },
  { id: "acc-p-003", titulo: "Toallitas Húmedas Para Perros Y Gatos X80 Sin Alcohol", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_634090-MLA107525754920_032026-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2ZesuP6", mascota: "perro" },
  { id: "acc-p-004", titulo: "Cucha Cama Casa Para Perro Razas Pequeñas Lavable Rimax", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_730499-MLA106671354697_022026-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/1yMXJrQ", mascota: "perro" },
  { id: "acc-p-005", titulo: "Comedero para mascotas automático e interactivo Smart-Tek PF150 con capacidad de 4kg color blanco", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_667505-MLA95634390544_102025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/345CGqe", mascota: "perro" },
  { id: "acc-p-006", titulo: "Bebedero Automático Dispenser De Agua P Perros Y Mascotas 4l", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_876343-MLA91740751447_092025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2NYmaBw", mascota: "perro" },
  { id: "acc-p-007", titulo: "Carrito Transportador De Mascotas Ruedas 360° Apto Aerolinea", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_812515-MLA92783955240_092025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/1oCUNrY", mascota: "perro" },

  // ─── Accesorios Gatos ────────────────────────────────────────────────────
  { id: "acc-g-001", titulo: "Gimnasio Rascador Para Gatos + Juguete Bajo Dakota Felpa Sisal", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_828408-MLA95666849680_102025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2JjbRiW", mascota: "gato" },
  { id: "acc-g-002", titulo: "Caja Inox. Doble Cerrada C/pala 60×40×37.8cm Antiderrame 15kg", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_996832-MLA106728599958_022026-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2RBy6Kh", mascota: "gato" },
  { id: "acc-g-003", titulo: "Rascador Super Torre Premium Gimnasio Para Gatos Exigentes", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_672322-MLA83412146408_042025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/226F8Nh", mascota: "gato" },
  { id: "acc-g-004", titulo: "Litera Catit Jumbo Para Gatos Baño Cerrado Filtro Anti Olor Color Gris", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_671938-MLA99983156053_112025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/1mtuv9c", mascota: "gato" },
  { id: "acc-g-005", titulo: "Bandeja Litera Mueble Sanitario Para Gatos Grande", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_946145-MLA93070326500_092025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/151nJHA", mascota: "gato" },
  { id: "acc-g-006", titulo: "Rascador Autoadhesivo Premium Sillón Esquinero Gatos 100x50", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_666289-MLA92512350122_092025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/1BGUZFX", mascota: "gato" },
  { id: "acc-g-007", titulo: "Rascador Gatos Sillón Alfombra Esquinero X 2 Unidades 50cm", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_728068-MLA108796918894_032026-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2bdztcj", mascota: "gato" },
  { id: "acc-g-008", titulo: "Rascador Tomaso Felpa Gatos Persa Siames Mascotas", imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_634091-MLA99607188663_112025-F.webp", categoria: "accesorios", linkAfiliado: "https://meli.la/2srgnwy", mascota: "gato" },
]

// Helper: obtener productos por slug de categoría
export function getProductosByCategoria(slug: string): ProductoCurado[] {
  return productosCurados.filter((p) => p.categoria === slug)
}

// Helper: obtener un producto por id
export function getProductoById(id: string): ProductoCurado | undefined {
  return productosCurados.find((p) => p.id === id)
}