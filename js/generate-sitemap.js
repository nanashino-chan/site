const fs = require("fs");

const domain = "https://nanashino-chan.github.io/site";

const urls = [
  { path: "/", priority: 1.0 },
  { path: "/today.html", priority: 0.97 },
  { path: "/licensing.html", priority: 0.96 },
  { path: "/contact.html", priority: 0.92 },

  { path: "/focus.html", priority: 0.95 },
  { path: "/study.html", priority: 0.94 },
  { path: "/sleep.html", priority: 0.94 },
  { path: "/relax.html", priority: 0.94 },

  { path: "/tokyo.html", priority: 0.93 },
  { path: "/cafe.html", priority: 0.93 },
  { path: "/jazzhop.html", priority: 0.93 },
  { path: "/synth.html", priority: 0.93 },

  { path: "/music.html", priority: 0.86 },
  { path: "/about.html", priority: 0.75 },
  { path: "/works.html", priority: 0.75 },

  { path: "/faq.html", priority: 0.8 },
  { path: "/commerce.html", priority: 0.6 },
  { path: "/terms.html", priority: 0.4 },
  { path: "/policy.html", priority: 0.4 },
];

const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `
  <url>
    <loc>${domain}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>
`).join("")}
</urlset>`;

fs.writeFileSync("sitemap.xml", xml);

console.log("✅ sitemap.xml generated");
