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
├── index.html              → único HTML del sitio (una sola página)
├── css/
│   └── style.css           → todos los estilos (antes estaban en <style> inline)
├── js/
│   └── script.js           → animaciones, carrusel del hero, menú (antes <script> inline)
├── images/
│   ├── favicon.ico
│   ├── logo.webp           → logo a color (nav)
│   ├── hero/                → 3 fotos del carrusel principal
│   ├── momentos/            → 3 fotos de "cada hora tiene su luz"
│   ├── suites/               → 4 fotos, una por tipo de suite
│   ├── refugio/              → foto de acceso a "El Refugio"
│   └── cierre/               → foto del cierre / CTA final
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
No lo tenía — ya está creado (`sitemap.xml`). Como es una sola página,
solo tiene una URL; su valor real es que Search Console lo pueda leer
para confirmar que la página existe y cuándo se actualizó.

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
