import fs from "fs";
import path from "path";

const cataloguePath = path.join(process.cwd(), "catalogue.json");
export function fetchPhotos() {
  const catalogueJson = JSON.parse(fs.readFileSync(cataloguePath));
  if (!catalogueJson) {
    throw new Error("Catalogue.json missing or path incorrect.");
  }

  // Get stats.json to include get download stats for each photo
  let stats;
  const statsPath = path.join(process.cwd(), "stats.json");
  if (fs.existsSync(statsPath)) {
    const statsJson = fs.readFileSync(statsPath);
    stats = JSON.parse(statsJson).stats;
  } else {
    // eslint-disable-next-line no-console
    console.log("Stats.json missing or path incorrect.");
    stats = {};
  }

  const { images } = catalogueJson;
  // Validate image and don't include if missing needed data
  const filteredImages = {};
  for (const image of images) {
    let isMissing = "";
    if (!image.title) {
      isMissing += "title";
    } else if (!image.slug) {
      isMissing += "slug";
    } else if (!image.bucket) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "bucket";
    } else if (!image.breakpoints) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "breakpoints";
    } else if (!image.model) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "model";
    } else if (!image.alt) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "alt";
    } else if (!image.tags) {
      if (isMissing) {
        isMissing += ", ";
      }
      isMissing += "tags";
    }
    if (isMissing) {
      // eslint-disable-next-line no-console
      console.warn(`Image, ${image?.slug} missing fields: ${isMissing}`);
    }

    // Add downloads to metadata
    if (stats[image.slug.toLowerCase()]) {
      const imageStats = stats[image.slug.toLowerCase()];
      image.downloads = imageStats.download_count;
      image.click = imageStats.homepage_click;
    } else {
      // If update-stats hasn't run since this image was added
      image.downloads = 0;
      image.click = 0;
    }

    filteredImages[image.slug.toLowerCase()] = image;
  }
  return {
    images: filteredImages,
    tags: catalogueJson.tags,
    models: catalogueJson.models,
  };
}
