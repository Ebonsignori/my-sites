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
    if ((newCatalogue.key = CatalogueService.CATALOGUE)) {
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

module.exports = {
  getCatalogue,
  setCatalogue,
};
