const fs = require("fs");
const path = require("path");

/* =====================================
Site Settings
===================================== */

const BASE_URL = "https://nanashino-chan.github.io/site";

const ROOT_DIR = path.join(__dirname, "..");
const SITE_DIR = path.join(ROOT_DIR, "site");
const SITE_PAGES_DIR = path.join(SITE_DIR, "pages");
const OUTPUT_PATH = path.join(SITE_DIR, "sitemap.xml");

/* =====================================
Core Pages
===================================== */

const pages = [
["/", "1.00", "weekly"],

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

["/music-for-music-curators.html", "0.90", "weekly"],
["/music-for-playlist-curators.html", "0.90", "weekly"],
["/lofi-music-for-playlists.html", "0.88", "weekly"],

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
Helpers
===================================== */

function formatDate(date) {
return date.toISOString().split("T")[0];
}

function escapeXml(str) {
return String(str)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

function getLastMod(filePath) {
try {
const stat = fs.statSync(filePath);
return formatDate(stat.mtime);
} catch (error) {
return formatDate(new Date());
}
}

function addPage(url, priority, changefreq, filePath) {
const exists = pages.some(page => page[0] === url);

if (!exists) {
pages.push([
url,
priority,
changefreq,
filePath
]);
}
}

/* =====================================
Add file paths to core pages
===================================== */

for (const page of pages) {
const url = page[0];

if (url === "/") {
page[3] = path.join(SITE_DIR, "index.html");
} else {
page[3] = path.join(SITE_DIR, url.replace(/^//, ""));
}
}

/* =====================================
Auto Add /site/*.html
===================================== */

if (fs.existsSync(SITE_DIR)) {
const rootFiles = fs
.readdirSync(SITE_DIR)
.filter(file => file.endsWith(".html"))
.sort();

rootFiles.forEach(file => {
const url = file === "index.html" ? "/" : `/${file}`;
const filePath = path.join(SITE_DIR, file);

```
let priority = "0.72";
let changefreq = "monthly";

if (file.includes("playlist") || file.includes("curator")) {
  priority = "0.82";
  changefreq = "weekly";
}

if (file.includes("licensing") || file.includes("license")) {
  priority = "0.86";
  changefreq = "weekly";
}

addPage(url, priority, changefreq, filePath);
```

});
}

/* =====================================
Auto Add /site/pages/*.html
===================================== */

if (fs.existsSync(SITE_PAGES_DIR)) {
const pageFiles = fs
.readdirSync(SITE_PAGES_DIR)
.filter(file => file.endsWith(".html"))
.sort();

pageFiles.forEach(file => {
const url = file === "index.html" ? "/pages/" : `/pages/${file}`;
const filePath = path.join(SITE_PAGES_DIR, file);

```
let priority = file === "index.html" ? "0.85" : "0.75";
let changefreq = file === "index.html" ? "weekly" : "monthly";

if (
  file.includes("license") ||
  file.includes("licensing") ||
  file.includes("commercial") ||
  file.includes("rights") ||
  file.includes("copyright") ||
  file.includes("content-id")
) {
  priority = "0.82";
  changefreq = "weekly";
}

if (
  file.includes("music-for") ||
  file.includes("youtube") ||
  file.includes("ai-video") ||
  file.includes("brand") ||
  file.includes("agency") ||
  file.includes("business")
) {
  priority = "0.80";
  changefreq = "weekly";
}

addPage(url, priority, changefreq, filePath);
```

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
Generate XML
===================================== */

const urls = uniquePages
.sort((a, b) => a[0].localeCompare(b[0]))
.map(([url, priority, changefreq, filePath]) => {
const fullUrl = url === "/" ? `${BASE_URL}/` : `${BASE_URL}${url}`;
const lastmod = getLastMod(filePath);

```
return `
```

  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?> <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls} </urlset>
`;

/* =====================================
Write File
===================================== */

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

fs.writeFileSync(
OUTPUT_PATH,
xml,
"utf8"
);

console.log(`✅ site/sitemap.xml generated (${uniquePages.length} URLs)`);
