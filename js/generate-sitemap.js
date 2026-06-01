const fs = require("fs");
const path = require("path");

/* =====================================
   Site Settings
===================================== */

const BASE_URL = "https://nanashino-chan.github.io/site";
const TODAY = new Date().toISOString().split("T")[0];

/* =====================================
   Core Pages
===================================== */

const pages = [
  ["/", "1.0", "weekly"],

  ["/today.html", "0.97", "weekly"],
  ["/licensing.html", "0.96", "weekly"],

  ["/focus.html", "0.95", "weekly"],
  ["/study.html", "0.94", "weekly"],
  ["/sleep.html", "0.94", "weekly"],
  ["/relax.html", "0.94", "weekly"],

  ["/tokyo.html", "0.93", "weekly"],
  ["/cafe.html", "0.93", "weekly"],
  ["/jazzhop.html", "0.93", "weekly"],
  ["/synth.html", "0.93", "weekly"],

  ["/contact.html", "0.92", "monthly"],

  ["/music.html", "0.86", "monthly"],

  ["/faq.html", "0.80", "monthly"],

  ["/about.html", "0.75", "monthly"],
  ["/works.html", "0.75", "monthly"],

  ["/commerce.html", "0.60", "yearly"],

  ["/terms.html", "0.40", "yearly"],
  ["/policy.html", "0.40", "yearly"]
];

/* =====================================
   Auto Add /pages/*.html
===================================== */

const pagesDir = path.join(__dirname, "..", "pages");

if (fs.existsSync(pagesDir)) {

  const files = fs
    .readdirSync(pagesDir)
    .filter(file => file.endsWith(".html"))
    .sort();

  files.forEach(file => {

    const url =
      file === "index.html"
        ? "/pages/"
        : `/pages/${file}`;

    const exists = pages.some(
      page => page[0] === url
    );

    if (!exists) {

      pages.push([
        url,
        file === "index.html" ? "0.85" : "0.75",
        file === "index.html" ? "weekly" : "monthly"
      ]);

    }

  });

}

/* =====================================
   Remove Duplicates
===================================== */

const uniquePages = [
  ...new Map(
    pages.map(page => [page[0], page])
  ).values()
];

/* =====================================
   XML Escape
===================================== */

function escapeXml(str) {

  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

}

/* =====================================
   Generate XML
===================================== */

const urls = uniquePages
  .map(([url, priority, changefreq]) => {

    const fullUrl =
      url === "/"
        ? `${BASE_URL}/`
        : `${BASE_URL}${url}`;

    return `
  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

/* =====================================
   Write File
===================================== */

const outputPath = path.join(
  __dirname,
  "..",
  "sitemap.xml"
);

fs.writeFileSync(
  outputPath,
  xml,
  "utf8"
);

console.log(
  `✅ sitemap.xml generated (${uniquePages.length} URLs)`
);
