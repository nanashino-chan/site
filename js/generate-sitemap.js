const fs = require("fs");
const path = require("path");

/* =====================================
Site Settings
===================================== */

const BASE_URL = "https://nanashino-chan.github.io/site";

const ROOT_DIR = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(ROOT_DIR, "pages");
const OUTPUT_PATH = path.join(ROOT_DIR, "sitemap.xml");

/* =====================================
Safety Check
===================================== */

if (!fs.existsSync(ROOT_DIR)) {
console.error("Error: root directory not found.");
console.error("Expected path: " + ROOT_DIR);
process.exit(1);
}

/* =====================================
Helpers
===================================== */

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

function escapeXml(str) {
const amp = String.fromCharCode(38);

return String(str)
.replace(/&/g, amp + "amp;")
.replace(/</g, amp + "lt;")
.replace(/>/g, amp + "gt;")
.replace(/"/g, amp + "quot;")
.replace(/'/g, amp + "apos;");
}

function addPage(pageList, url, priority, changefreq, filePath) {
const exists = pageList.some(function(page) {
return page.url === url;
});

if (!exists) {
pageList.push({
url: url,
priority: priority,
changefreq: changefreq,
filePath: filePath
});
}
}

/* =====================================
Pages
===================================== */

const pages = [];

/* =====================================
Auto Add /*.html
===================================== */

const rootFiles = fs
.readdirSync(ROOT_DIR)
.filter(function(file) {
return file.endsWith(".html");
})
.sort();

rootFiles.forEach(function(file) {
const filePath = path.join(ROOT_DIR, file);
const url = file === "index.html" ? "/" : "/" + file;

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
file.indexOf("playlist") !== -1 ||
file.indexOf("curator") !== -1 ||
file.indexOf("music-for") !== -1
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
Auto Add /pages/*.html
===================================== */

if (fs.existsSync(PAGES_DIR)) {
const pageFiles = fs
.readdirSync(PAGES_DIR)
.filter(function(file) {
return file.endsWith(".html");
})
.sort();

pageFiles.forEach(function(file) {
const filePath = path.join(PAGES_DIR, file);
const url = file === "index.html" ? "/pages/" : "/pages/" + file;


let priority = file === "index.html" ? "0.85" : "0.75";
let changefreq = file === "index.html" ? "weekly" : "monthly";

if (
  file.indexOf("license") !== -1 ||
  file.indexOf("licensing") !== -1 ||
  file.indexOf("commercial") !== -1 ||
  file.indexOf("sync") !== -1 ||
  file.indexOf("rights") !== -1 ||
  file.indexOf("copyright") !== -1 ||
  file.indexOf("content-id") !== -1 ||
  file.indexOf("youtube") !== -1
) {
  priority = "0.82";
  changefreq = "weekly";
}

if (
  file.indexOf("music-for") !== -1 ||
  file.indexOf("brand") !== -1 ||
  file.indexOf("business") !== -1 ||
  file.indexOf("agency") !== -1 ||
  file.indexOf("client") !== -1 ||
  file.indexOf("ai") !== -1
) {
  priority = "0.80";
  changefreq = "weekly";
}

addPage(pages, url, priority, changefreq, filePath);

});
}

/* =====================================
Sort Pages
===================================== */

pages.sort(function(a, b) {
return a.url.localeCompare(b.url);
});

/* =====================================
Generate XML
===================================== */

const xmlLines = [];

xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
xmlLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

pages.forEach(function(page) {
const fullUrl = page.url === "/" ? BASE_URL + "/" : BASE_URL + page.url;
const lastmod = getLastMod(page.filePath);

xmlLines.push("  <url>");
xmlLines.push("    <loc>" + escapeXml(fullUrl) + "</loc>");
xmlLines.push("    <lastmod>" + escapeXml(lastmod) + "</lastmod>");
xmlLines.push("    <changefreq>" + escapeXml(page.changefreq) + "</changefreq>");
xmlLines.push("    <priority>" + escapeXml(page.priority) + "</priority>");
xmlLines.push("  </url>");
});

xmlLines.push("</urlset>");

const xml = xmlLines.join("\n") + "\n";

/* =====================================
Write File
===================================== */

fs.writeFileSync(
OUTPUT_PATH,
xml,
"utf8"
);

console.log("Sitemap generated successfully.");
console.log("Root: " + ROOT_DIR);
console.log("Output: " + OUTPUT_PATH);
console.log("URLs: " + pages.length);
