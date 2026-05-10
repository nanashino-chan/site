const fs = require("fs");
const path = require("path");

const baseUrl = "https://nanashino-chan.github.io/site";

const today = new Date().toISOString().split("T")[0];

const pages = [];

function scanDir(dir, basePath = "") {

  const files = fs.readdirSync(dir);

  files.forEach(file => {

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {

      scanDir(fullPath, `${basePath}/${file}`);

    } else if (file.endsWith(".html")) {

      let urlPath = `${basePath}/${file}`;

      urlPath = urlPath.replace("/index.html", "/");

      pages.push(urlPath);
    }

  });
}

scanDir(".");

const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${pages.map(page => `

  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

`).join("")}

</urlset>`;

fs.writeFileSync("sitemap.xml", xml);

console.log("Sitemap generated!");
