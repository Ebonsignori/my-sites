/* eslint-disable no-console */
// Set env before importing anything else
const setEnv = require("./utils/set-env");
const { IMAGE_QUALITY, PORT, SOCKET_PORT, BACKEND_URL } = setEnv();

const express = require("express");
const { createServer } = require("http");
const next = require("next");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const CatalogueService = require("./utils/catalogue-service");
const S3 = require("./utils/s3");
const {
  getCatalogue,
  setCatalogue,
  syncCatalogue,
  deleteFromCatalogue,
} = require("./routes/catalogue");

const MAIN_ROOM = "main";

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
  const httpServer = createServer(server);
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    socket.join(MAIN_ROOM);
  });
  httpServer.listen(SOCKET_PORT);

  server.get("/catalogue/:bucket", async (req, res) => {
    return getCatalogue(req, res, s3);
  });
  server.put("/catalogue/:bucket", async (req, res) => {
    return setCatalogue(req, res, s3);
  });
  server.put("/catalogue/:bucket/sync", async (req, res) => {
    return syncCatalogue(req, res, s3);
  });
  server.delete("/catalogue/:bucket/:slug", async (req, res) => {
    return deleteFromCatalogue(req, res, s3);
  });

  server.post("/upload", async (req, res) => {
    const {
      imageData,
      updateCatalogue,
      title,
      dimensions,
      slug,
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
    console.log(`Received image ${slug}.`);

    let { imageQuality } = req.body;
    if (!imageQuality) {
      imageQuality = IMAGE_QUALITY;
    }

    // Create directory to save the intermediary files in for AWS upload
    const imageDirectory = path.join(TEMP_UPLOAD_PATH, slug);
    fs.mkdirSync(imageDirectory, { recursive: true });

    // Create image buffer
    const imageBuffer = new Buffer(
      imageData.replace(/^data:image\/[a-z]+;base64,/, ""),
      "base64"
    );

    if (updateCatalogue) {
      const catalogueRes = await catalogueService.addToCatalogue(bucket, {
        slug,
        folder,
        bucket,
        dimensions,
        date,
        description,
        alt,
        model,
        tags,
        breakpoints,
        location,
      });
      io.to(MAIN_ROOM).emit("upload-part", {
        msg: `Updated Catalogue`,
        url: catalogueRes.Location,
      });
    }

    console.log("Resizing and uploading...");
    const uploadPromises = [...breakpoints, "original"].map(
      async (breakpoint) => {
        const isOriginal = breakpoint === "original";
        let extension = "webp";
        if (isOriginal) {
          extension = "jpeg";
        }
        const imagePattern = `${slug}-${breakpoint}.${extension}`;
        let imageKey = `${slug}/${imagePattern}`;
        if (folder) {
          imageKey = `${folder}/${imageKey}`;
        }
        const imagePath = path.join(imageDirectory, imagePattern);
        const existsInS3 = await s3.exists(bucket, imageKey);

        if (existsInS3) {
          const errorMsg = `Image with key: "${imageKey}" already exists in s3 bucket.`;
          throw errorMsg;
        }

        let uploadRes;
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
          uploadRes = await s3.upload({
            Bucket: bucket,
            Key: imageKey,
            Body: uploadBuffer,
            ContentType: `image/${extension}`,
            ContentLanguage: "en-US",
            ACL: "public-read",
            // Cache each image "indefinitely"
            CacheControl: "max-age: 31536000",
            Metadata: {
              title,
              alt,
              model,
              dimensions: JSON.stringify(dimensions),
              imageQuality: isOriginal ? "100" : imageQuality,
              tags: JSON.stringify(tags),
              location: JSON.stringify(location),
              metadata: JSON.stringify({
                OriginalFilename: metadata.OriginalFilename,
                LensModel: metadata.LensModel,
                GPSAltitude: metadata.GPSAltitude,
                GPSDestBearingRef: metadata.GPSDestBearingRef,
                LensInfo: metadata.LensInfo,
                ExposureTime: metadata.ExposureTime,
                ApertureValue: metadata.ApertureValue,
                ShutterSpeedValue: metadata.ShutterSpeedValue,
                ISO: metadata.ISO,
                CreateDate: metadata.CreateDate,
                ModifyDate: metadata.ModifyDate,
                FNumber: metadata.FNumber,
              }),
            },
          });
        } catch (error) {
          console.log(error);
          io.to(MAIN_ROOM).emit("upload-part-fail", {
            msg:
              `Error resizing image to size ${breakpoint}.` +
              ` clean up any successful files manually.`,
            errorMsg: error.message,
          });
          console.log(`Error resizing image to size ${breakpoint}`);
          const errorMsg = `Error resizing image to size ${breakpoint}`;
          throw errorMsg;
        }
        console.log(`Resized ${imageKey} uploaded to S3.`);
        io.to(MAIN_ROOM).emit("upload-part", {
          msg: `Resized ${imageKey} uploaded to S3.`,
          url: uploadRes.Location,
        });
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
      success: `Resized ${slug} and uploaded to ${bucket}`,
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
