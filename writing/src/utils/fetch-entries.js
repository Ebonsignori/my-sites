import fs from "fs";
import matter from "gray-matter";
import path from "path";

const entriesPath = path.join(process.cwd(), "entries");
export function fetchEntries() {
  // Get stats.json to include read count for each article
  const statsJson = fs.readFileSync(path.join(process.cwd(), "stats.json"));
  const { stats } = JSON.parse(statsJson);

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
    // Validate entry
    let isMissing = "";
    if (!metadata.data.slug) {
      isMissing += "slug";
    } else if (!metadata.data.title) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "title";
    } else if (!metadata.data.date) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "date";
    } else if (!metadata.excerpt) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "preview";
    } else if (!metadata.data.category) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "category";
    }
    if (isMissing) {
      throw new Error(`Entry, ${entry} missing metadata fields: ${isMissing}`);
    }
    metadata.data.preview = metadata.excerpt;

    // Add engagedSessions to metadata
    metadata.data.viewCount = stats[metadata.data.slug].engagedSessions;

    entriesMap[metadata.data.slug] = metadata;
  }
  return entriesMap;
}

// We fetch each entry again so we don't have to name mdx files by slug
export function getEntryBySlug(slug) {
  const entriesMap = fetchEntries();
  const res = {};
  const entries = Object.entries(entriesMap);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][0] === slug) {
      res.current = entries[i][1];
      if (i - 1 >= 0) {
        res.prev = entries[i - 1][1];
      }
      if (i + 1 < entries.length) {
        res.next = entries[i + 1][1];
      }
      break;
    }
  }
  return res;
}
