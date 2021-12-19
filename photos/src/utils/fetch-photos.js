import fs from "fs";
import path from "path";

const cataloguePath = path.join(process.cwd(), "catalogue.json");
export function fetchPhotos() {
  const catalogueJson = JSON.parse(fs.readFileSync(cataloguePath));
  if (!catalogueJson) {
    throw new Error("Catalogue.json missing or path incorrect.");
  }

  // Get stats.json to include get download stats for each photo
  const statsJson = fs.readFileSync(path.join(process.cwd(), "stats.json"));
  const { stats } = JSON.parse(statsJson);
  if (!stats) {
    throw new Error("Stats.json missing or path incorrect.");
  }

  const { images } = catalogueJson;
  // Validate image and don't include if missing needed data
  const filteredImages = {};
  for (const image of images) {
    let isMissing = "";
    if (!image.name) {
      isMissing += "name";
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
      console.warn(`Image, ${image?.name} missing fields: ${isMissing}`);
    }

    // Add downloads to metadata
    if (stats[image.name]) {
      const imageStats = stats[image.name];
      image.downloads = imageStats.downloads;
    } else {
      // If update-stats hasn't run since this image was added
      image.downloads = 0;
    }

    filteredImages[image.name] = image;
  }
  return {
    images: filteredImages,
    tags: catalogueJson.tags,
    models: catalogueJson.models,
  };
}
