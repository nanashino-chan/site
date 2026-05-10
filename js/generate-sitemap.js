const fs = require("fs");

const baseUrl = "https://nanashino-chan.github.io/site";

const today = new Date().toISOString().split("T")[0];

// 手動管理ページ
const pages = [
  ["", "1.0", "weekly"],
  ["/today.html", "0.97", "weekly"],
  ["/licensing.html", "0.96", "weekly"],
  ["/contact.html", "0.92", "weekly"],
  ["/focus.html", "0.95", "weekly"],
  ["/study.html", "0.94", "weekly"],
  ["/sleep.html", "0.94", "weekly"],
  ["/relax.html", "0.94", "weekly"],
  ["/music.html", "0.86", "monthly"],
  ["/faq.html", "0.8", "monthly"]
];

// pagesフォルダを自動追加
const pageFiles = fs.readdirSync("./pages");

pageFiles.forEach(file => {

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

fs.writeFileSync("sitemap.xml", xml);

console.log("Sitemap generated!");
