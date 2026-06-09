# Reporte Semanal de Analytics en n8n → Notion

Workflow automático que extrae métricas de Google Analytics 4 y Google Search Console cada lunes a las 9 AM y crea una página nueva en Notion con el resumen de la semana.

---

## Prerequisitos

- Cuenta en [n8n Cloud](https://app.n8n.cloud)
- Acceso de administrador a tu propiedad de Google Analytics 4
- Sitio verificado en Google Search Console
- Workspace de Notion con una base de datos para guardar los reportes

---

## Paso 1 — Importar el workflow

1. Abrí [n8n Cloud](https://app.n8n.cloud) e ingresá a tu workspace.
2. En el menú lateral, hacé clic en **Workflows → New → Import from file**.
3. Seleccioná el archivo `reporte_analytics_n8n.json`.
4. El workflow se importa con 5 nodos. Todavía no lo actives — primero hay que configurar las credenciales.

---

## Paso 2 — Credencial de Google Analytics

1. En n8n, ir a **Settings → Credentials → New Credential**.
2. Buscar y seleccionar **Google Analytics OAuth2 API**.
3. Seguir el flujo OAuth para conectar tu cuenta de Google (la que tiene acceso a la propiedad de GA4).
4. Guardar con el nombre `Google Analytics OAuth2`.
5. En el nodo **Google Analytics** del workflow, asignar esta credencial.
6. En el campo **Property ID**, ingresar el ID de tu propiedad GA4:
   - Lo encontrás en GA4 → Configuración de administrador → Detalles de la propiedad → **ID de propiedad** (solo el número, ej: `123456789`).

---

## Paso 3 — Credencial de Google Search Console

Search Console no tiene nodo nativo en n8n, pero se conecta vía OAuth2 genérico:

1. En n8n, ir a **Settings → Credentials → New Credential**.
2. Buscar y seleccionar **OAuth2 API**.
3. Completar los campos:
   - **Grant Type**: `Authorization Code`
   - **Authorization URL**: `https://accounts.google.com/o/oauth2/auth`
   - **Access Token URL**: `https://oauth2.googleapis.com/token`
   - **Scope**: `https://www.googleapis.com/auth/webmasters.readonly`
   - **Auth URI Query Parameters**: `access_type=offline&prompt=consent`
4. Para obtener el **Client ID** y **Client Secret**:
   - Ir a [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials.
   - Crear un **OAuth 2.0 Client ID** de tipo *Web application*.
   - Agregar como redirect URI la URL que te muestra n8n en el formulario de credencial.
   - Habilitar la API **Google Search Console API** en tu proyecto de GCP.
5. Guardar la credencial con el nombre `Google OAuth2 (Search Console)`.
6. En el nodo **Search Console** del workflow, asignar esta credencial.
7. En la URL del nodo, reemplazar `REEMPLAZAR_URL_SITIO` por la URL exacta de tu sitio tal como figura en Search Console (ej: `https://tiendaosvaldo.com/` — con la barra al final si así aparece).

---

## Paso 4 — Credencial de Notion

1. En Notion, ir a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration**.
2. Darle un nombre (ej: `n8n Analytics`), seleccionar tu workspace y guardar.
3. Copiar el **Internal Integration Token**.
4. En n8n, ir a **Settings → Credentials → New Credential → Notion API**.
5. Pegar el token y guardar.
6. En el nodo **Crear Página en Notion**, asignar esta credencial.

### Configurar la base de datos de Notion

1. En Notion, crear una nueva base de datos (tabla) donde se guardarán los reportes semanales. Una propiedad `Name` (título) es suficiente para empezar.
2. Darle acceso a tu integración: abrir la base de datos → `···` (menú) → **Connections** → agregar `n8n Analytics`.
3. Copiar el **Database ID**: está en la URL de la base de datos, es el string de 32 caracteres antes del `?` (ej: `https://notion.so/workspace/`**`abc123def456...`**`?v=...`).
4. En el nodo **Crear Página en Notion**, reemplazar `REEMPLAZAR_DATABASE_ID` con ese ID.

---

## Paso 5 — Verificar la zona horaria

El workflow ya está configurado con zona horaria `America/Argentina/Buenos_Aires`. Para verificarlo:

1. Abrir el workflow → Settings (ícono de engranaje).
2. Confirmar que **Timezone** dice `America/Argentina/Buenos_Aires`.

---

## Paso 6 — Probar antes de activar

1. Abrir el workflow y hacer clic en **Test workflow** (sin activar).
2. Revisar que cada nodo muestre datos en verde:
   - **Google Analytics**: debe retornar sesiones, pageviews, usuarios.
   - **Search Console**: debe retornar clics, impresiones, CTR, posición.
   - **Formatear Datos**: debe mostrar los valores formateados.
   - **Crear Página en Notion**: debe crear la página en tu base de datos.
3. Si algún nodo falla, el error aparece en rojo con el mensaje. Los problemas más comunes son credenciales mal asignadas o IDs incorrectos.

---

## Paso 7 — Activar

Una vez que la prueba funciona:

1. Hacer clic en el toggle **Active** (arriba a la derecha del workflow).
2. El workflow correrá automáticamente todos los lunes a las 9:00 AM (hora de Argentina).

---

## Estructura del reporte en Notion

Cada lunes se crea una nueva página con este formato:

```
Reporte Semanal — YYYY-MM-DD al YYYY-MM-DD
──────────────────────────────────────────
📊 Google Analytics — Últimos 7 días
  👥 Usuarios totales: X.XXX  |  🆕 Usuarios nuevos: X.XXX
  🔄 Sesiones: X.XXX          |  📄 Páginas vistas: X.XXX

🔍 Google Search Console — Últimos 7 días
  🖱️ Clics: X.XXX    |  👁️ Impresiones: XX.XXX
  📈 CTR: X.XX%      |  🏆 Posición promedio: X.X
──────────────────────────────────────────
📅 Período: YYYY-MM-DD → YYYY-MM-DD
```

---

## Resumen de valores a reemplazar

| Nodo              | Campo                  | Dónde obtenerlo                          |
|-------------------|------------------------|------------------------------------------|
| Google Analytics  | Property ID            | GA4 → Admin → Detalles de propiedad     |
| Search Console    | URL del sitio en la URL | Search Console → tu propiedad verificada |
| Crear Página Notion | Database ID          | URL de la base de datos en Notion        |

---

## Solución de problemas frecuentes

**Search Console retorna 403**: la cuenta OAuth no tiene acceso al sitio en Search Console, o la API no está habilitada en Google Cloud Console.

**GA retorna sin datos**: el Property ID es incorrecto. Asegurate de usar solo el número (sin el prefijo `properties/`).

**Notion retorna 404**: la integración no tiene acceso a la base de datos. Verificar que se conectó correctamente en el paso 4.

**La página se crea sin contenido**: revisar el nodo "Formatear Datos" — si hay un error allí, los datos no llegan al nodo de Notion.
