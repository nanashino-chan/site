const fs = require("fs");
const path = require("path");

const baseUrl = "https://nanashino-chan.github.io/site";

const today = new Date().toISOString().split("T")[0];

/* =========================
   手動管理ページ
========================= */

const pages = [
  ["", "1.0", "weekly"],
  ["/today.html", "0.97", "weekly"],
  ["/licensing.html", "0.96", "weekly"],
  ["/contact.html", "0.92", "monthly"],
  ["/focus.html", "0.95", "weekly"],
  ["/study.html", "0.94", "weekly"],
  ["/sleep.html", "0.94", "weekly"],
  ["/relax.html", "0.94", "weekly"],
  ["/tokyo.html", "0.93", "weekly"],
  ["/cafe.html", "0.93", "weekly"],
  ["/jazzhop.html", "0.93", "weekly"],
  ["/synth.html", "0.93", "weekly"],
  ["/music.html", "0.86", "monthly"],
  ["/about.html", "0.75", "monthly"],
  ["/works.html", "0.75", "monthly"],
  ["/faq.html", "0.80", "monthly"],
  ["/commerce.html", "0.60", "yearly"],
  ["/terms.html", "0.40", "yearly"],
  ["/policy.html", "0.40", "yearly"]
];

/* =========================
   /pages/ を自動追加
========================= */

const pagesDir = path.join(__dirname, "..", "pages");

if (fs.existsSync(pagesDir)) {

  const files = fs.readdirSync(pagesDir);

  files.forEach(file => {

    if (
      file.endsWith(".html") &&
      file !== "index.html"
    ) {

      pages.push([
        `/pages/${file}`,
        "0.75",
        "monthly"
      ]);

    }

  });

}

/* =========================
   sitemap.xml 生成
========================= */

const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${pages.map(p => `
  <url>
    <loc>${baseUrl}${p[0]}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p[2]}</changefreq>
    <priority>${p[1]}</priority>
  </url>
`).join("")}

</urlset>`;

/* =========================
   出力
========================= */

const outputPath = path.join(__dirname, "..", "sitemap.xml");

fs.writeFileSync(outputPath, xml);

console.log("✅ sitemap.xml generated successfully!");
