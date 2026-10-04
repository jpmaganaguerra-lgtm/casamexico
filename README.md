# Casa México Suites — Sitio Web

Landing page del hotel boutique Casa México, frente al Zócalo del Centro
Histórico de la Ciudad de México. Antes era un solo archivo HTML con todo
embebido (imágenes en base64, CSS y JS inline); en esta versión el sitio
está separado en carpetas para poder subirlo a GitHub, darle mantenimiento
y que cargue más rápido (los navegadores cachean CSS/JS/imágenes por
separado).

## Estructura de carpetas

```
casa-mexico-website/
├── index.html              → home del sitio (una sola página)
├── css/
│   ├── style.css           → todos los estilos del home (antes estaban en <style> inline)
│   └── blog.css            → estilos del blog (portada + artículos), extiende style.css
├── js/
│   └── script.js           → animaciones, carrusel del hero, menú (antes <script> inline)
├── images/
│   ├── favicon.ico
│   ├── logo.webp           → logo a color (nav)
│   ├── hero/                → 3 fotos del carrusel principal
│   ├── momentos/            → 3 fotos de "cada hora tiene su luz"
│   ├── suites/               → 4 fotos, una por tipo de suite
│   ├── refugio/              → foto de acceso a "El Refugio"
│   ├── cierre/               → foto del cierre / CTA final
│   └── blog/                 → portadas de los artículos (las sube el backoffice)
├── blog/
│   ├── index.html           → portada de "Vocero del Zócalo" (se regenera sola)
│   ├── posts.json           → fuente de verdad: todas las entradas del blog
│   ├── build.js             → motor que genera el HTML de cada entrada/portada/sitemap
│   ├── build-site.js        → script de Node para regenerar todo localmente
│   └── posts/
│       └── <slug>.html       → una página HTML por entrada (se generan solas)
├── admin/
│   └── index.html           → backoffice "Vocero del Zócalo" (publicar/editar/borrar entradas)
├── robots.txt
├── sitemap.xml
└── README.md
```

El widget de reservación (Octorate) se dejó **inline** dentro de
`index.html`, tal como estaba: es un script de un tercero que valida el
dominio en el que corre, así que no conviene moverlo a un archivo aparte.

## Subir esto a GitHub

Desde esta carpeta (`casa-mexico-website/`):

```bash
git init
git add .
git commit -m "Sitio Casa México — estructura de carpetas"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

Si vas a publicarlo con **GitHub Pages**: Settings → Pages → Deploy from
branch → `main` / `/ (root)`. Si usas otro hosting (Vercel, Netlify, tu
propio servidor), esta misma carpeta se sube tal cual: es HTML/CSS/JS
estático, sin build ni dependencias.

## Dominio

Todas las etiquetas de SEO (canonical, Open Graph, Twitter Card, datos
estructurados, sitemap y robots.txt) ya apuntan a `https://www.lacasamexico.com/`.

---

## El blog: Vocero del Zócalo

Es un blog pensado para SEO y GEO (que los motores de IA como ChatGPT,
Perplexity o Google AI Overviews puedan citar a Casa México): crónicas,
guías y cultura del Centro Histórico, con contenido que atrae búsquedas
que van más allá de "hotel en el Zócalo" — "qué ver en el Centro
Histórico", "speakeasy CDMX", "dónde hospedarse cerca del Zócalo" — y
que además reduce la dependencia de Airbnb al traer tráfico directo.

Arranca con 3 artículos ya publicados (`blog/posts.json`):
1. **La ruta esencial para recorrer el Centro Histórico alrededor del Zócalo**
2. **La cultura speakeasy en la Ciudad de México: el arte de lo oculto**
3. **Guía práctica para hospedarte en el Centro Histórico de la Ciudad de México**

Cada entrada es una página HTML independiente — nada de JavaScript
renderizando el contenido en el navegador — para que cualquier buscador
o IA que rastree el sitio pueda leerla directamente, sin ejecutar nada.
Cada una trae su propio título, meta descripción, Open Graph y datos
estructurados `BlogPosting` (Schema.org).

### Cómo funciona por dentro

`blog/posts.json` es la única fuente de verdad: un arreglo con todas las
entradas (título, slug, extracto, meta descripción, categoría, etiquetas,
imagen de portada, fecha, y el cuerpo en HTML). A partir de ahí,
`blog/build.js` genera:
- `blog/posts/<slug>.html` — la página de cada entrada
- `blog/index.html` — la portada del blog, con las tarjetas de todas las entradas
- `sitemap.xml` — con la home, la portada del blog y cada entrada

Si alguna vez quieres regenerar todo a mano después de editar
`posts.json` directamente (sin pasar por el backoffice), corres:

```bash
node blog/build-site.js
```

Necesitas tener [Node.js](https://nodejs.org) instalado; no usa ninguna
librería externa.

## El backoffice (`/admin/`)

Es el panel para publicar, editar y borrar entradas del blog sin tocar
código. No tiene servidor propio: es una sola página HTML que, al
guardar, hace commits directo a tu repositorio de GitHub usando su API
— por eso cualquier cambio se ve reflejado en el sitio en cuanto GitHub
Pages (o el hosting que uses) vuelve a desplegar, normalmente en
segundos.

### Cómo entrar por primera vez

1. Abre `tudominio.com/admin/` (no está enlazado desde el menú del
   sitio ni indexado por buscadores — `robots.txt` lo excluye — pero
   cualquiera con el link puede *verlo*; lo que de verdad lo protege es
   que sin un token válido con permiso de escritura sobre tu repo, no
   se puede publicar nada).
2. Ve a GitHub → tu ícono de perfil → **Settings** → **Developer
   settings** → **Fine-grained tokens** → **Generate new token**.
   - **Repository access:** solo el repositorio de este sitio.
   - **Permissions:** `Contents` → **Read and write**.
   - Cópialo — GitHub solo te lo muestra una vez.
3. En la pestaña **Conexión** del backoffice, llena usuario/organización
   de GitHub, nombre del repositorio, la rama (`main` normalmente) y
   pega el token. "Conectar y probar" confirma que todo esté bien.
4. Marca "Recordar estos datos en este navegador" si es una computadora
   de confianza — así no tienes que volver a pegar el token cada vez.
   Si es una compu compartida, mejor déjalo sin marcar.

### Publicar una entrada

En **Entradas** → **+ Nueva entrada**: título (el slug/URL se genera
solo, pero lo puedes editar antes de guardar — después de la primera
publicación queda fijo, para no romper el link), categoría, fecha,
etiquetas, extracto, meta descripción, imagen de portada, y el cuerpo
del artículo con un editor simple (negrita, cursiva, subtítulos, listas,
citas, enlaces) o directamente en HTML si lo prefieres (pestaña "HTML").
"Vista previa" abre el artículo tal cual se va a ver, sin publicar nada
todavía. "Publicar" hace los commits: sube la imagen, guarda
`posts.json`, crea la página del artículo, actualiza la portada del
blog y el sitemap — los cuatro pasos en una sola operación, con una
bitácora en pantalla de cada uno.

Editar o eliminar una entrada existente funciona igual, desde
**Entradas** → **Editar**.

### Una nota sobre seguridad

El token que generas en GitHub es, en la práctica, la contraseña de
este backoffice: quien lo tenga puede publicar en tu nombre. Trátalo
como tal — no lo compartas por mensaje de texto o correo sin cifrar, y
si alguna vez crees que se filtró, revócalo desde GitHub (Settings →
Developer settings → el token en cuestión → Delete) y genera uno nuevo.

---

## Respuestas a tus preguntas de SEO / GEO

**¿Cómo estaba la estrategia de SEO y GEO? ¿Estaba optimizada?**
El sitio ya traía lo básico bien hecho: un solo `<h1>`, jerarquía correcta
de `<h2>`/`<h3>` por sección, y **alt text descriptivo en las 13 imágenes**
(esto es justo lo que más ayuda a GEO — los motores generativos como
ChatGPT, Perplexity o Google AI Overviews se apoyan mucho en texto
estructurado y descriptivo, no solo en palabras clave). Lo que faltaba, y
que ya agregué en esta versión:

- **Open Graph + Twitter Card** — sin esto, cuando alguien comparte el
  link en WhatsApp, Instagram o X, no aparecía imagen ni descripción
  bonita, solo el link pelón.
- **Datos estructurados (Schema.org, tipo `Hotel`)** — un bloque JSON-LD
  con nombre, dirección, teléfono y rango de precio. Esto es lo que más
  impacta en GEO: le da a los motores de IA y a Google datos factuales
  limpios para citar tu hotel directamente (nombre, ubicación, qué
  ofreces) en vez de tener que "adivinar" a partir del texto de la página.
- **`<link rel="canonical">`** — evita problemas si el sitio se sirve
  desde `www.` y sin `www.` a la vez.
- **`robots.txt` y `sitemap.xml`** — no existían (ver siguiente pregunta).

Lo que yo recomendaría como siguiente paso, fuera del alcance de esta
entrega: contenido tipo preguntas frecuentes (FAQ) con su propio schema
`FAQPage` — es lo que mejor le funciona a los motores de IA para citar
respuestas directas ("¿cuántas suites tiene Casa México?", "¿está cerca
del Zócalo?"), y reforzaría aún más el GEO.

**¿Tienes sitemap XML?**
No lo tenías — ya está creado (`sitemap.xml`), y ahora se regenera solo
cada vez que publicas, editas o borras una entrada del blog desde el
backoffice (home + portada del blog + cada artículo). Su valor real es
que Search Console lo pueda leer para confirmar qué páginas existen y
cuándo se actualizó cada una.

**¿Tienes que subirlo a Google Search Console?**
Sí, es recomendable. Pasos, una vez que el sitio esté publicado en su
dominio real:
1. Entra a [search.google.com/search-console](https://search.google.com/search-console)
   y agrega la propiedad con tu dominio.
2. Verifica la propiedad (la opción más simple aquí es "Etiqueta HTML":
   te da un `<meta name="google-site-verification" ...>` que agregas al
   `<head>` de `index.html`, o verificación por DNS si prefieres).
3. Una vez verificado, ve a "Sitemaps" y da de alta
   `https://tu-dominio.com/sitemap.xml`.
4. Usa "Inspección de URLs" sobre la home y pide indexación manual la
   primera vez, para no esperar al rastreo natural.

**¿Meta titles and descriptions?**
Al ser una sola página, solo necesita un título y una descripción (no uno
por sección). Los que ya traía el sitio están bien dimensionados:

- Title (68 caracteres): *"Casa México — Hotel Boutique Frente al Zócalo,
  Centro Histórico CDMX"*
- Description (145 caracteres): *"Diez suites privadas sobre el Zócalo
  de la Ciudad de México. Hotel boutique de diseño en el corazón del
  Centro Histórico. Reserva directa."*

Ambos están dentro de los límites que Google no trunca (~60 caracteres
para el title, ~155-160 para la description), así que los dejé igual;
solo les añadí su versión "social" (Open Graph/Twitter) para que se vean
igual de bien cuando se comparten fuera de Google.

Las entradas del blog sí llevan su propio título y meta descripción
cada una — se escriben al momento de publicar, directamente en el
backoffice (los campos "Título" y "Meta descripción" del editor).
