const fs = require("fs");
const path = require("path");

/* =====================================
Site Settings
===================================== */

const BASE_URL = "https://nanashino-chan.github.io/site";

const ROOT_DIR = path.resolve(__dirname, "..");
const SITE_DIR = path.join(ROOT_DIR, "site");
const PAGES_DIR = path.join(SITE_DIR, "pages");
const OUTPUT_PATH = path.join(SITE_DIR, "sitemap.xml");

/* =====================================
Safety Check
===================================== */

if (!fs.existsSync(SITE_DIR)) {
console.error("❌ Error: site directory not found.");
console.error(`Expected path: ${SITE_DIR}`);
process.exit(1);
}

/* =====================================
Helpers
===================================== */

function escapeXml(str) {
return String(str)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

function formatDate(date) {
return date.toISOString().split("T")[0];
}

function getLastMod(filePath) {
try {
const stat = fs.statSync(filePath);
return formatDate(stat.mtime);
} catch (error) {
return formatDate(new Date());
}
}

function addPage(pageList, url, priority, changefreq, filePath) {
const exists = pageList.some(page => page.url === url);

if (!exists) {
pageList.push({
url,
priority,
changefreq,
filePath
});
}
}

/* =====================================
Pages
===================================== */

const pages = [];

/* =====================================
Add /site/*.html
===================================== */

const rootFiles = fs
.readdirSync(SITE_DIR)
.filter(file => file.endsWith(".html"))
.sort();

rootFiles.forEach(file => {
const filePath = path.join(SITE_DIR, file);
const url = file === "index.html" ? "/" : `/${file}`;

let priority = "0.70";
let changefreq = "monthly";

if (file === "index.html") {
priority = "1.00";
changefreq = "weekly";
} else if (file === "today.html") {
priority = "0.97";
changefreq = "weekly";
} else if (file === "licensing.html") {
priority = "0.96";
changefreq = "weekly";
} else if (
file === "focus.html" ||
file === "study.html" ||
file === "sleep.html" ||
file === "relax.html"
) {
priority = "0.94";
changefreq = "weekly";
} else if (
file === "tokyo.html" ||
file === "cafe.html" ||
file === "jazzhop.html" ||
file === "synth.html"
) {
priority = "0.93";
changefreq = "weekly";
} else if (
file.includes("playlist") ||
file.includes("curator") ||
file.includes("music-for")
) {
priority = "0.86";
changefreq = "weekly";
} else if (
file === "music.html" ||
file === "works.html" ||
file === "contact.html"
) {
priority = "0.82";
changefreq = "monthly";
} else if (
file === "faq.html" ||
file === "about.html"
) {
priority = "0.75";
changefreq = "monthly";
} else if (
file === "terms.html" ||
file === "policy.html" ||
file === "commerce.html"
) {
priority = "0.40";
changefreq = "yearly";
}

addPage(pages, url, priority, changefreq, filePath);
});

/* =====================================
Add /site/pages/*.html
===================================== */

if (fs.existsSync(PAGES_DIR)) {
const pageFiles = fs
.readdirSync(PAGES_DIR)
.filter(file => file.endsWith(".html"))
.sort();

pageFiles.forEach(file => {
const filePath = path.join(PAGES_DIR, file);
const url = file === "index.html" ? "/pages/" : `/pages/${file}`;

```
let priority = file === "index.html" ? "0.85" : "0.75";
let changefreq = file === "index.html" ? "weekly" : "monthly";

if (
  file.includes("license") ||
  file.includes("licensing") ||
  file.includes("commercial") ||
  file.includes("sync") ||
  file.includes("rights") ||
  file.includes("copyright") ||
  file.includes("content-id") ||
  file.includes("youtube")
) {
  priority = "0.82";
  changefreq = "weekly";
}

if (
  file.includes("music-for") ||
  file.includes("brand") ||
  file.includes("business") ||
  file.includes("agency") ||
  file.includes("client") ||
  file.includes("ai")
) {
  priority = "0.80";
  changefreq = "weekly";
}

addPage(pages, url, priority, changefreq, filePath);
```

});
}

/* =====================================
Sort Pages
===================================== */

pages.sort((a, b) => a.url.localeCompare(b.url));

/* =====================================
Generate XML
===================================== */

const urls = pages
.map(page => {
const fullUrl =
page.url === "/"
? `${BASE_URL}/`
: `${BASE_URL}${page.url}`;

```
const lastmod = getLastMod(page.filePath);

return `  <url>
<loc>${escapeXml(fullUrl)}</loc>
<lastmod>${lastmod}</lastmod>
<changefreq>${escapeXml(page.changefreq)}</changefreq>
<priority>${escapeXml(page.priority)}</priority>
```

</url>`;
})
.join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls} </urlset>
`;

/* =====================================
Write File
===================================== */

fs.writeFileSync(OUTPUT_PATH, xml, "utf8");

console.log(`✅ Sitemap generated successfully.`);
console.log(`📄 Output: ${OUTPUT_PATH}`);
console.log(`🔗 URLs: ${pages.length}`);
