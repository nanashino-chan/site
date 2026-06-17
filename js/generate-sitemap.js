const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

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

function getRelativePath(filePath) {
return path.relative(ROOT_DIR, filePath).split(path.sep).join("/");
}

function getGitLastMod(filePath) {
try {
const relativePath = getRelativePath(filePath);


const output = childProcess.execFileSync(
  "git",
  ["log", "-1", "--format=%cs", "--", relativePath],
  {
    cwd: ROOT_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  }
).trim();

if (/^\d{4}-\d{2}-\d{2}$/.test(output)) {
  return output;
}


} catch (error) {
return null;
}

return null;
}

function getLastMod(filePath) {
const gitDate = getGitLastMod(filePath);

if (gitDate) {
return gitDate;
}

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

function hasAnyKeyword(file, keywords) {
return keywords.some(function(keyword) {
return file.indexOf(keyword) !== -1;
});
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
Auto Add Root HTML Files
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
Auto Add Pages HTML Files
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

const coreSeoKeywords = [
  "license",
  "licensing",
  "commercial",
  "sync",
  "rights",
  "copyright",
  "content-id",
  "youtube",
  "claim",
  "claims",
  "monetization",
  "master-license",
  "proof-of-music-license",
  "music-license-documentation"
];

const businessKeywords = [
  "music-for",
  "brand",
  "business",
  "agency",
  "agencies",
  "client",
  "saas",
  "b2b",
  "linkedin",
  "marketing",
  "product-demo",
  "app-demo",
  "corporate",
  "ecommerce"
];

const aiKeywords = [
  "music-for-ai",
  "ai-video",
  "ai-content",
  "ai-generated",
  "ai-marketing",
  "ai-avatar",
  "ai-youtube",
  "ai-commercial",
  "copyright-safe-music-for-ai"
];

if (hasAnyKeyword(file, coreSeoKeywords)) {
  priority = "0.82";
  changefreq = "weekly";
} else if (
  hasAnyKeyword(file, businessKeywords) ||
  hasAnyKeyword(file, aiKeywords)
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
