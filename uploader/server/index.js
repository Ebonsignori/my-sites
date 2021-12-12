/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const CatalogueService = require("./utils/catalogue-service");
const setEnv = require("./utils/set-env");
const S3 = require("./utils/s3");
const { getCatalogue, setCatalogue } = require("./routes/catalogue");

const { IMAGE_QUALITY, PORT, BACKEND_URL } = setEnv();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const TEMP_UPLOAD_PATH = path.join(__dirname, "uploads");
if (!fs.existsSync(TEMP_UPLOAD_PATH)) {
  fs.mkdirSync(TEMP_UPLOAD_PATH);
}

async function main() {
  const s3 = new S3();
  const catalogueService = new CatalogueService(s3);
  await app.prepare();

  const server = express();
  server.use(bodyParser.json({ limit: "200mb" }));

  server.get("/catalogue/:bucket", async (req, res) => {
    return getCatalogue(req, res, s3);
  });
  server.put("/catalogue/:bucket", async (req, res) => {
    return setCatalogue(req, res, s3);
  });

  server.post("/upload", async (req, res) => {
    const {
      imageData,
      updateCatalogue,
      name,
      date,
      breakpoints,
      bucket,
      folder,
      metadata,
      description,
      alt,
      location,
      tags,
      model,
    } = req.body;
    console.log(`Received image ${name}.`);

    let { imageQuality } = req.body;
    if (!imageQuality) {
      imageQuality = IMAGE_QUALITY;
    }

    // Create directory to save the intermediary files in for AWS upload
    const imageDirectory = path.join(TEMP_UPLOAD_PATH, name);
    fs.mkdirSync(imageDirectory, { recursive: true });

    // Create image buffer
    const imageBuffer = new Buffer(
      imageData.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64"
    );

    if (updateCatalogue) {
      await catalogueService.addToCatalogue(bucket, {
        name,
        folder,
        bucket,
        date,
        description,
        alt,
        model,
        tags,
        breakpoints,
        location,
      });
    }

    console.log("Resizing and uploading...");
    const uploadUrls = [];
    const uploadPromises = [...breakpoints, "original"].map(
      async (breakpoint) => {
        const isOriginal = breakpoint === "original";
        let extension = "webp";
        if (isOriginal) {
          extension = "jpeg";
        }
        const imagePattern = `${name}-${breakpoint}.${extension}`;
        let imageKey = `${name}/${imagePattern}`;
        if (folder) {
          imageKey = `${folder}/${imageKey}`;
        }
        const imagePath = path.join(imageDirectory, imagePattern);
        const existsInS3 = await s3.exists(bucket, imageKey);

        if (existsInS3) {
          const errorMsg = `Image with key: "${imageKey}" already exists in s3 bucket.`;
          throw errorMsg;
        }

        try {
          if (isOriginal) {
            await sharp(imageBuffer)
              .withMetadata()
              .jpeg({ quality: 100 })
              .toFile(imagePath);
          } else {
            await sharp(imageBuffer)
              .resize(parseInt(breakpoint, 10))
              .webp({ quality: parseInt(imageQuality, 10) })
              .toFile(imagePath);
          }
          const uploadBuffer = fs.readFileSync(imagePath);
          const uploadRes = await s3.upload({
            Bucket: bucket,
            Key: imageKey,
            Body: uploadBuffer,
            ContentType: `image/${extension}`,
            ContentLanguage: "en-US",
            ACL: "public-read",
            // Cache each image "indefinitely"
            CacheControl: "max-age: 31536000",
            Metadata: {
              description,
              alt,
              model,
              imageQuality: isOriginal ? "100" : imageQuality,
              tags: JSON.stringify(tags),
              location: JSON.stringify(location),
              breakpoints: JSON.stringify(breakpoints),
              metadata: JSON.stringify(metadata),
            },
          });
          uploadUrls.push(uploadRes.Location);
        } catch (error) {
          console.log(error);
          const errorMsg = `Error resizing image to size ${breakpoint}`;
          throw errorMsg;
        }
        console.log(`Resized ${imageKey} uploaded to S3.`);
      }
    );

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.log(error);
      return res.json({
        error,
      });
    }

    console.log("Upload complete. Removing intermediate files from disk...");
    fs.rmSync(TEMP_UPLOAD_PATH, { recursive: true });
    fs.mkdirSync(TEMP_UPLOAD_PATH);
    console.log("Done.");

    return res.json({
      success: `Resized ${name} and uploaded to ${bucket}`,
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on ${BACKEND_URL}:${PORT}`);
  });
}

main();
