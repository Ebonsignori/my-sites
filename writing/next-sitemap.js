const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const env = dotenv.parse(fs.readFileSync(path.join(__dirname, "..", ".env")));

module.exports = {
  siteUrl: env.WRITING_PAGE_URL,
  generateRobotsTxt: true,
  changefreq: "weekly",
  outDir: "build",
  priority: 0.5,
  transform: async (config, loc) => {
    let priority = config.priority;
    if (loc === "/") {
      priority = 1;
    }
    // Use default transformation for all other cases
    return {
      loc,
      changefreq: config.changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
