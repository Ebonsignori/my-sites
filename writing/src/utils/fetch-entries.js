import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { csvToArray } from "../../../shared/utils/strings";
import stripMarkdown from "../utils/strip-markdown";

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
    } else if (!metadata.data.categories) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "categories";
    } else if (!metadata.data.image) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "image";
    } else if (!metadata.data.imageAlt) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "imageAlt";
    } else if (!metadata.data.imageCaption) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "imageCaption";
    }
    if (isMissing) {
      throw new Error(`Entry, ${entry} missing metadata fields: ${isMissing}`);
    }

    // Clean markdown out of excerpt
    // NOTE: Will not remove footnotes
    metadata.data.preview = stripMarkdown(metadata.excerpt);

    // Add popularity to metadata.
    if (stats[metadata.data.slug]) {
      const articleStats = stats[metadata.data.slug.toLowerCase()];
      metadata.data.popularity = articleStats.has_read;
    } else {
      // If update-stats hasn't run since this article was added
      metadata.data.popularity = 0;
    }

    // Convert categories to array from CSV
    metadata.data.categories = csvToArray(metadata.data.categories);

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
