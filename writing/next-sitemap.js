const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const env = dotenv.parse(fs.readFileSync(path.join(__dirname, "..", ".env")));

module.exports = {
  siteUrl: env.WRITING_PAGE_URL,
  generateRobotsTxt: true,
  changefreq: "never",
  outDir: "build",
  priority: 0.5,
  transform: async (config, loc) => {
    let lastmod = new Date().toISOString();
    let changefreq = config.changefreq;
    let priority = config.priority;
    if (loc === "/") {
      priority = 1;
      changefreq = "weekly";
    } else {
      changefreq = "yearly";
    }

    // Exclude WIP articles from site-map
    const entry = getEntryBySlug(loc.replace("/", ""));
    if (entry?.data?.isWip) {
      return null;
    }
    if (entry?.data?.lastModified) {
      lastmod = new Date(entry.data.lastModified).toISOString();
    } else if (entry?.data?.date) {
      lastmod = new Date(entry.data.date).toISOString();
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

const entriesPath = path.join(process.cwd(), "entries");
function fetchEntries() {
  const entriesMap = {};
  const entries = fs.readdirSync(entriesPath);
  for (const entry of entries) {
    if (!entry.endsWith(".mdx")) {
      continue;
    }
    const fileContents = fs.readFileSync(
      path.join(entriesPath, entry),
      "utf-8"
    );
    const metadata = matter(fileContents, {
      // eslint-disable-next-line camelcase
      excerpt_separator: "<!-- end-preview -->",
    });
    entriesMap[metadata.data.slug] = metadata;
  }
  return entriesMap;
}

// We fetch each entry again so we don't have to name mdx files by slug
function getEntryBySlug(slug) {
  const entriesMap = fetchEntries();
  const entries = Object.entries(entriesMap);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][0] === slug) {
      return entries[i][1];
    }
  }
}
