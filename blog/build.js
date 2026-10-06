/* ============================================================
   VOCERO DEL ZÓCALO — motor de plantillas del blog
   Este archivo se usa en DOS contextos, sin modificarse:
     1) Node, para (re)generar el sitio localmente:
          node blog/build-site.js
     2) El navegador, dentro de /admin/ — el backoffice llama a
        estas mismas funciones para publicar/editar entradas.
   Por eso no usa `document`, `fetch` ni nada exclusivo de un
   solo entorno: solo recibe datos y devuelve strings de HTML/XML.
   ============================================================ */
(function (root) {
  "use strict";

  var SITE_URL = "https://www.lacasamexico.com";
  var SITE_NAME = "Casa México";
  var BLOG_NAME = "Vocero del Zócalo";

  var GTM_HEAD =
    "<!-- Google Tag Manager -->\n" +
    "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n" +
    "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n" +
    "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n" +
    "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n" +
    "})(window,document,'script','dataLayer','GTM-WZGLNSL8');</script>\n" +
    "<!-- End Google Tag Manager -->";

  var GTM_BODY =
    "<!-- Google Tag Manager (noscript) -->\n" +
    '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZGLNSL8"\n' +
    'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n' +
    "<!-- End Google Tag Manager (noscript) -->";

  var MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  function slugify(str) {
    return String(str)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function formatDateLong(dateStr) {
    var parts = String(dateStr).split("-").map(Number);
    var y = parts[0], m = parts[1], d = parts[2];
    return d + " de " + MESES[m - 1] + " de " + y;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function absUrl(relPath) {
    return SITE_URL + "/" + String(relPath).replace(/^\/+/, "");
  }

  // depth: 0 = raíz (index.html), 1 = blog/ (blog/index.html),
  //        2 = blog/posts/ (blog/posts/slug.html)
  function prefix(depth) {
    return depth === 0 ? "" : depth === 1 ? "../" : "../../";
  }

  function navHTML(depth) {
    var p = prefix(depth);
    var home = depth === 0 ? "#" : p + "index.html";
    var blogHome = depth === 2 ? "../index.html" : "index.html";
    return (
      '<nav id="nav" class="' + (depth > 0 ? "scrolled" : "") + '">\n' +
      '  <a href="' + home + '" class="nav-logo" aria-label="Casa México">\n' +
      '    <img src="' + p + 'images/logo.webp" class="nav-logo-mark" alt="Casa México logo" width="567" height="567" aria-hidden="true">\n' +
      '    <span class="nav-logo-text">Casa México</span>\n' +
      "  </a>\n" +
      '  <ul class="nav-links" id="navLinks">\n' +
      '    <li><a href="' + p + 'index.html#suites">Suites</a></li>\n' +
      '    <li><a href="' + p + 'index.html#ubicacion">Ubicación</a></li>\n' +
      '    <li><a href="' + p + 'index.html#refugio">El Refugio</a></li>\n' +
      '    <li><a href="' + blogHome + '">Vocero del Zócalo</a></li>\n' +
      "  </ul>\n" +
      '  <a href="' + p + 'index.html#reservar" class="nav-cta">Reservar</a>\n' +
      '  <button class="hamburger" id="hamburger" aria-label="Menú">\n' +
      "    <span></span><span></span><span></span>\n" +
      "  </button>\n" +
      "</nav>"
    );
  }

  function footerHTML(depth) {
    var p = prefix(depth);
    var blogHome = depth === 2 ? "../index.html" : "index.html";
    return (
      "<footer>\n" +
      '  <div class="container">\n' +
      '    <div class="footer-top">\n' +
      "      <div>\n" +
      '        <div class="footer-brand-name">\n' +
      '          <svg width="20" height="20" viewBox="0 0 80 80" fill="none" aria-hidden="true"><circle cx="40" cy="40" r="36" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><circle cx="40" cy="40" r="28" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><circle cx="40" cy="40" r="10" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><circle cx="40" cy="40" r="4" fill="rgba(243,239,232,.4)"/><line x1="40" y1="4" x2="40" y2="14" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><line x1="40" y1="66" x2="40" y2="76" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><line x1="4" y1="40" x2="14" y2="40" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><line x1="66" y1="40" x2="76" y2="40" stroke="rgba(243,239,232,.4)" stroke-width="1.2"/><circle cx="65.5" cy="14.5" r="1.5" fill="rgba(243,239,232,.4)"/><circle cx="65.5" cy="65.5" r="1.5" fill="rgba(243,239,232,.4)"/><circle cx="14.5" cy="14.5" r="1.5" fill="rgba(243,239,232,.4)"/><circle cx="14.5" cy="65.5" r="1.5" fill="rgba(243,239,232,.4)"/></svg>\n' +
      "          Casa México\n" +
      "        </div>\n" +
      '        <p class="footer-tagline">Un refugio privado de diseño en el corazón histórico de México. Diez suites. Una perspectiva irrepetible.</p>\n' +
      "      </div>\n" +
      "      <div>\n" +
      '        <h4 class="footer-col-title">Hotel</h4>\n' +
      '        <ul class="footer-links">\n' +
      '          <li><a href="' + p + 'index.html#suites">Las Suites</a></li>\n' +
      '          <li><a href="' + p + 'index.html#refugio">El Refugio</a></li>\n' +
      '          <li><a href="' + p + 'index.html#ubicacion">Ubicación</a></li>\n' +
      '          <li><a href="' + p + 'index.html#reservar">Reservar</a></li>\n' +
      '          <li><a href="' + blogHome + '">Vocero del Zócalo</a></li>\n' +
      "        </ul>\n" +
      "      </div>\n" +
      "      <div>\n" +
      '        <h4 class="footer-col-title">Contacto</h4>\n' +
      '        <ul class="footer-links">\n' +
      '          <li><a href="tel:+525518214245" class="footer-phone"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>+52 55 1821 4245</a></li>\n' +
      '          <li><a href="https://wa.me/525543496735">WhatsApp</a></li>\n' +
      '          <li><a href="mailto:hola@casamexicohotel.mx">hola@casamexicohotel.mx</a></li>\n' +
      '          <li><a href="' + p + 'index.html#ubicacion">Centro Histórico, CDMX</a></li>\n' +
      "        </ul>\n" +
      "      </div>\n" +
      "      <div>\n" +
      '        <h4 class="footer-col-title">Síguenos</h4>\n' +
      '        <ul class="footer-links">\n' +
      '          <li><a href="https://www.instagram.com/casamexicozocalo" target="_blank" rel="noopener">Instagram</a></li>\n' +
            '          <li><a href="https://www.tiktok.com/@casamexicozocalo" target="_blank" rel="noopener">TikTok</a></li>\n' +
      "        </ul>\n" +
      '        <h4 class="footer-col-title" style="margin-top:1.5rem">Legal</h4>\n' +
      '        <ul class="footer-links">\n' +
      '          <li><a href="#">Privacidad</a></li>\n' +
      '          <li><a href="#">Términos</a></li>\n' +
      "        </ul>\n" +
      "      </div>\n" +
      "    </div>\n" +
      '    <div class="footer-bottom">\n' +
      '      <p class="footer-copy">© 2026 Casa México · Hotel Boutique · Centro Histórico Ciudad de México</p>\n' +
      '      <div class="footer-seo">\n' +
      '        <a href="#">Hotel con vista al Zócalo</a>\n' +
      '        <a href="#">Hotel boutique Centro Histórico</a>\n' +
      '        <a href="#">Suite King CDMX</a>\n' +
      '        <a href="#">Hotel Grito Independencia</a>\n' +
      '        <a href="#">Hotel Día de Muertos CDMX</a>\n' +
      '        <a href="#">Hospedaje frente al Zócalo</a>\n' +
      "      </div>\n" +
      "    </div>\n" +
      "  </div>\n" +
      "</footer>"
    );
  }

  function headCommon(depth, title, description, canonicalPath) {
    var p = prefix(depth);
    return (
      GTM_HEAD + "\n" +
      '<meta charset="UTF-8">\n' +
      '<link rel="icon" type="image/x-icon" href="' + p + 'images/favicon.ico">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      "<title>" + escapeHtml(title) + "</title>\n" +
      '<meta name="description" content="' + escapeHtml(description) + '">\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet">\n' +
      '<link rel="stylesheet" href="' + p + 'css/style.css">\n' +
      '<link rel="stylesheet" href="' + p + 'css/blog.css">\n' +
      '<link rel="canonical" href="' + absUrl(canonicalPath) + '">\n' +
      '<meta name="robots" content="index, follow">\n' +
      '<meta name="theme-color" content="#2F2925">'
    );
  }

  function ogTags(type, title, description, imagePath, canonicalPath) {
    var img = absUrl(imagePath);
    return (
      '<meta property="og:type" content="' + type + '">\n' +
      '<meta property="og:site_name" content="' + SITE_NAME + '">\n' +
      '<meta property="og:title" content="' + escapeHtml(title) + '">\n' +
      '<meta property="og:description" content="' + escapeHtml(description) + '">\n' +
      '<meta property="og:image" content="' + img + '">\n' +
      '<meta property="og:url" content="' + absUrl(canonicalPath) + '">\n' +
      '<meta property="og:locale" content="es_MX">\n' +
      '<meta name="twitter:card" content="summary_large_image">\n' +
      '<meta name="twitter:title" content="' + escapeHtml(title) + '">\n' +
      '<meta name="twitter:description" content="' + escapeHtml(description) + '">\n' +
      '<meta name="twitter:image" content="' + img + '">'
    );
  }

  // ---- PÁGINA INDIVIDUAL DE ARTÍCULO (blog/posts/<slug>.html) ----
  function buildPostHTML(post) {
    var canonicalPath = "blog/posts/" + post.slug + ".html";
    var title = post.title + " — " + BLOG_NAME + " | " + SITE_NAME;
    var tagsHtml = (post.tags || [])
      .map(function (t) { return '<span class="article-tag">' + escapeHtml(t) + "</span>"; })
      .join("\n          ");

    var jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.metaDescription,
      "image": absUrl(post.coverImage),
      "datePublished": post.date,
      "dateModified": post.date,
      "author": { "@type": "Organization", "name": SITE_NAME, "url": absUrl("") },
      "publisher": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": absUrl(""),
        "logo": { "@type": "ImageObject", "url": absUrl("images/logo.webp") },
        "sameAs": [
          "https://www.instagram.com/casamexicozocalo",
          "https://www.tiktok.com/@casamexicozocalo"
        ]
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": absUrl(canonicalPath) }
    }, null, 2);

    return (
      "<!DOCTYPE html>\n" +
      '<html lang="es">\n' +
      "<head>\n" +
      headCommon(2, title, post.metaDescription, canonicalPath) + "\n" +
      ogTags("article", post.title, post.metaDescription, post.coverImage, canonicalPath) + "\n" +
      '<script type="application/ld+json">\n' + jsonLd + "\n</script>\n" +
      "</head>\n" +
      '<body class="blog">\n' + GTM_BODY + '\n\n' +
      navHTML(2) + "\n\n" +
      '<section class="article-header">\n' +
      '  <div class="container">\n' +
      '    <p class="breadcrumb"><a href="../../index.html">Inicio</a><span>/</span><a href="../index.html">Vocero del Zócalo</a><span>/</span>' + escapeHtml(post.title) + "</p>\n" +
      '    <span class="article-category">' + escapeHtml(post.category) + "</span>\n" +
      '    <h1 class="article-title">' + escapeHtml(post.title) + "</h1>\n" +
      '    <div class="article-meta"><span>' + formatDateLong(post.date) + "</span><span>" + escapeHtml(post.category) + "</span></div>\n" +
      "  </div>\n" +
      "</section>\n\n" +
      '<div class="container">\n' +
      '  <div class="article-cover"><img src="../../' + post.coverImage + '" alt="' + escapeHtml(post.title) + '"></div>\n' +
      '  <div class="article-body">\n' + post.bodyHtml + "\n  </div>\n" +
      (tagsHtml ? '  <div class="article-tags">\n          ' + tagsHtml + "\n  </div>\n" : "") +
      '  <div class="article-cta">\n' +
      "    <p>Vive el Centro Histórico desde una suite frente al Zócalo.</p>\n" +
      '    <a href="../../index.html#reservar" class="btn-primary">Reservar en Casa México</a>\n' +
      "  </div>\n" +
      '  <div class="back-to-blog"><a href="../index.html">&larr; Volver a Vocero del Zócalo</a></div>\n' +
      "</div>\n\n" +
      footerHTML(2) + "\n\n" +
      '<script src="../../js/script.js" defer></script>\n' +
      "</body>\n</html>\n"
    );
  }

  // ---- ÍNDICE DEL BLOG (blog/index.html) ----
  function buildIndexHTML(posts) {
    var published = (posts || []).filter(function (p) { return p.published !== false; });
    published.sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    var canonicalPath = "blog/";
    var title = BLOG_NAME + " — Historias del Centro Histórico | " + SITE_NAME;
    var description = "Crónicas, guías y cultura del Centro Histórico de la Ciudad de México, contadas desde Casa México, frente al Zócalo.";

    var cardsHtml = published.length
      ? published.map(function (post) {
          return (
            '<a href="posts/' + post.slug + '.html" class="blog-card">\n' +
            '  <div class="blog-card-img"><img src="../' + post.coverImage + '" alt="' + escapeHtml(post.title) + '" loading="lazy"></div>\n' +
            '  <span class="blog-card-category">' + escapeHtml(post.category) + "</span>\n" +
            "  <h2>" + escapeHtml(post.title) + "</h2>\n" +
            "  <p>" + escapeHtml(post.excerpt) + "</p>\n" +
            '  <span class="blog-card-date">' + formatDateLong(post.date) + "</span>\n" +
            "</a>"
          );
        }).join("\n")
      : '<p class="blog-empty">Pronto, nuevas historias del Centro Histórico.</p>';

    var jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": BLOG_NAME,
      "description": description,
      "url": absUrl(canonicalPath),
      "publisher": { "@type": "Organization", "name": SITE_NAME }
    }, null, 2);

    return (
      "<!DOCTYPE html>\n" +
      '<html lang="es">\n' +
      "<head>\n" +
      headCommon(1, title, description, canonicalPath) + "\n" +
      ogTags("website", title, description, published[0] ? published[0].coverImage : "images/hero/hero-02-zocalo.jpg", canonicalPath) + "\n" +
      '<script type="application/ld+json">\n' + jsonLd + "\n</script>\n" +
      "</head>\n" +
      '<body class="blog">\n' + GTM_BODY + '\n\n' +
      navHTML(1) + "\n\n" +
      '<header class="blog-header">\n' +
      '  <div class="container">\n' +
      '    <p class="eyebrow">Vocero del Zócalo</p>\n' +
      "    <h1>Historias desde el <em>corazón</em><br>de la ciudad.</h1>\n" +
      '    <div class="rule"></div>\n' +
      "    <p>Crónicas, guías y cultura del Centro Histórico — contadas desde Casa México, frente al Zócalo.</p>\n" +
      "  </div>\n" +
      "</header>\n\n" +
      '<section class="blog-section">\n' +
      '  <div class="container">\n' +
      '    <div class="blog-grid">\n' + cardsHtml + "\n    </div>\n" +
      "  </div>\n" +
      "</section>\n\n" +
      footerHTML(1) + "\n\n" +
      '<script src="../js/script.js" defer></script>\n' +
      "</body>\n</html>\n"
    );
  }

  // ---- SITEMAP.XML (raíz del sitio) ----
  function buildSitemapXML(posts) {
    var published = (posts || []).filter(function (p) { return p.published !== false; });
    var latestDate = published.reduce(function (max, p) {
      return p.date > max ? p.date : max;
    }, published[0] ? published[0].date : "2026-09-30");
    var urls = [
      { loc: absUrl(""), lastmod: latestDate, changefreq: "monthly", priority: "1.0" },
      { loc: absUrl("blog/"), lastmod: latestDate, changefreq: "weekly", priority: "0.8" }
    ];
    published.forEach(function (post) {
      urls.push({
        loc: absUrl("blog/posts/" + post.slug + ".html"),
        lastmod: post.date,
        changefreq: "monthly",
        priority: "0.6"
      });
    });

    var body = urls.map(function (u) {
      return (
        "  <url>\n" +
        "    <loc>" + u.loc + "</loc>\n" +
        "    <lastmod>" + u.lastmod + "</lastmod>\n" +
        "    <changefreq>" + u.changefreq + "</changefreq>\n" +
        "    <priority>" + u.priority + "</priority>\n" +
        "  </url>"
      );
    }).join("\n");

    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      body + "\n" +
      "</urlset>\n"
    );
  }

  var VZ = {
    SITE_URL: SITE_URL,
    slugify: slugify,
    formatDateLong: formatDateLong,
    buildPostHTML: buildPostHTML,
    buildIndexHTML: buildIndexHTML,
    buildSitemapXML: buildSitemapXML
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = VZ; // Node (build-site.js)
  } else {
    root.VZ = VZ; // navegador (admin/index.html)
  }
})(typeof window !== "undefined" ? window : this);
