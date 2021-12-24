const CatalogueService = require("../utils/catalogue-service");

async function getCatalogue(req, res, s3) {
  const { bucket } = req.params;
  try {
    const catalogueService = new CatalogueService(s3);
    const catalogue = await catalogueService.getCatalogue(bucket);
    res.json(catalogue);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.json({
      error: "Error fetching catalogue. Check server logs.",
    });
  }
}

async function setCatalogue(req, res, s3) {
  const catalogue = req.body;
  const { bucket } = req.params;
  try {
    const catalogueService = new CatalogueService(s3);
    const newCatalogue = await catalogueService.replaceCatalogue(
      bucket,
      catalogue
    );
    if (newCatalogue.key === CatalogueService.CATALOGUE) {
      res.json({
        success: "Updated catalogue!",
      });
    } else {
      res.json({
        error: "Something went wrong when updating catalogue",
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.json({
      error: "Error setting catalogue. Check server logs.",
    });
  }
}

async function syncCatalogue(req, res, s3) {
  const { bucket } = req.params;
  try {
    const catalogueService = new CatalogueService(s3);
    const catalogue = await catalogueService.syncCatalogue(bucket);
    res.json({
      success: "Synced catalogue!",
      catalogue,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.json({
      error: "Error syncing catalogue. Check server logs.",
    });
  }
}

async function deleteFromCatalogue(req, res, s3) {
  const { bucket, slug } = req.params;
  try {
    const catalogueService = new CatalogueService(s3);
    // eslint-disable-next-line no-console
    console.log("Removing from catalogue...");
    const removeRes = await catalogueService.removeFromCatalogue(bucket, slug);
    if (removeRes) {
      // Remove from S3
      let deleteKey = slug;
      if (removeRes.deletedObj.folder) {
        deleteKey = `${removeRes.deletedObj.folder}/${deleteKey}/`;
      }
      // eslint-disable-next-line no-console
      console.log("Removing from bucket...");
      const removeS3Res = await s3.removeFolder(
        removeRes.deletedObj.bucket,
        deleteKey
      );
      // eslint-disable-next-line no-console
      console.log("Removed ", slug);
      // eslint-disable-next-line no-console
      console.log(removeS3Res);
      res.json({
        success: `Deleted ${slug} from catalogue and S3.`,
        catalogue: removeRes.catalogue,
      });
    } else {
      res.json({
        error: "Something went wrong when deleting from catalogue",
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    if (error.message.includes("No image in catalogue with slug")) {
      res.json({
        error: error.message,
      });
    } else {
      res.json({
        error: "Error deleting from catalogue. Check server logs.",
      });
    }
  }
}

module.exports = {
  getCatalogue,
  setCatalogue,
  syncCatalogue,
  deleteFromCatalogue,
};
