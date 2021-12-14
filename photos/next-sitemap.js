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
    // TODO: Get .mdx isWip metadata from loc
    // In production, only add to entries to sitemap if not a WIP post
    // if (process.env.NODE_ENV === "production") {
      // return null;
    // }

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
