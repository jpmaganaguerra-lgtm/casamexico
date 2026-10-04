#!/usr/bin/env node
/**
 * Regenera el blog completo a partir de blog/posts.json:
 *   - blog/index.html
 *   - blog/posts/<slug>.html (uno por cada entrada)
 *   - sitemap.xml (en la raíz del sitio)
 *
 * Uso:  node blog/build-site.js
 *
 * Esto es exactamente lo mismo que hace /admin/ al publicar o editar
 * una entrada, solo que corriendo en tu máquina en vez de en el
 * navegador — útil si alguna vez quieres regenerar todo de golpe
 * (por ejemplo, después de editar posts.json a mano).
 */
const fs = require("fs");
const path = require("path");
const VZ = require("./build.js");

const ROOT = path.join(__dirname, "..");
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, "posts.json"), "utf8"));

// blog/index.html
fs.writeFileSync(path.join(__dirname, "index.html"), VZ.buildIndexHTML(posts));
console.log("✓ blog/index.html");

// blog/posts/<slug>.html
const postsDir = path.join(__dirname, "posts");
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
posts.forEach((post) => {
  const outPath = path.join(postsDir, post.slug + ".html");
  fs.writeFileSync(outPath, VZ.buildPostHTML(post));
  console.log("✓ blog/posts/" + post.slug + ".html");
});

// sitemap.xml (raíz)
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), VZ.buildSitemapXML(posts));
console.log("✓ sitemap.xml");

console.log("\nListo — " + posts.length + " entradas generadas.");
