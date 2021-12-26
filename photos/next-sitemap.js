const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const env = dotenv.parse(fs.readFileSync(path.join(__dirname, "..", ".env")));

module.exports = {
  siteUrl: env.PHOTOS_PAGE_URL,
  generateRobotsTxt: true,
  changefreq: "monthly",
  outDir: "build",
  priority: 0.5,
  transform: async (config, loc) => {
    let lastmod = new Date().toISOString();
    let changefreq = config.changefreq;
    let priority = config.priority;
    if (loc === "/") {
      priority = 1;
    }
    if (loc === "/licence") {
      lastmod = new Date("12/26/2021").toISOString();
      changefreq = "never";
      priority = 0.5;
    }
    if (loc === "/photo-map") {
      priority = 0.8;
    }

    // Use default transformation for all other cases
    return {
      loc,
      changefreq,
      priority,
      lastmod,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
