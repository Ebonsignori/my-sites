import fs from "fs";
import matter from "gray-matter";
import path from "path";

const entriesPath = path.join(process.cwd(), "entries");
export function fetchEntries() {
  const entriesMap = {};
  const entries = fs.readdirSync(entriesPath);
  for (const entry of entries) {
    const fileContents = fs.readFileSync(
      path.join(entriesPath, entry),
      "utf-8"
    );
    const metadata = matter(fileContents, {
      // eslint-disable-next-line camelcase
      excerpt_separator: "<!-- end-preview -->",
    });
    // In production, only add to entries if not a WIP post
    if (process.env.NODE_ENV === "production" && metadata.data.isWip) {
      continue;
    }
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
