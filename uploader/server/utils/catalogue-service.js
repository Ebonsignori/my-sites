const { csvStrToArray } = require("./misc");

const CATALOGUE = "catalogue.json";
const INIT_CATALOGUE = {
  tags: [csvStrToArray("IMAGE_TAGS")],
  breakpoints: [csvStrToArray("IMAGE_BREAKPOINTS")],
  models: [csvStrToArray("IMAGE_MODELS")],
  images: [],
};
const uploadParams = {
  ContentType: "application/json",
  ContentLanguage: "en-US",
  ACL: "public-read",
  Key: CATALOGUE,
};

class CatalogueService {
  static CATALOGUE;

  constructor(s3) {
    this.s3 = s3;
  }

  async getCatalogue(bucket) {
    if (!this.catalogue) {
      const exists = await this.s3.exists(bucket, CATALOGUE);
      if (!exists) {
        await this.initCatalogue(bucket);
      }
      this.catalogue = await this.s3.get(bucket, CATALOGUE);
      this.catalogue = JSON.parse(this.catalogue.Body.toString());
    }
    return this.catalogue;
  }

  async addToCatalogue(bucket, obj) {
    await this.getCatalogue(bucket);
    const newCatalogue = { ...this.catalogue };
    newCatalogue.images = [...newCatalogue.images, obj];
    this.catalogue = newCatalogue;
    await this.replaceCatalogue(bucket, newCatalogue);
  }

  async replaceCatalogue(bucket, catalogue) {
    await this.getCatalogue(bucket);
    await this.s3.remove(bucket, CATALOGUE);
    const res = await this.s3.upload({
      ...uploadParams,
      Bucket: bucket,
      Body: JSON.stringify(catalogue),
    });
    return res;
  }

  async initCatalogue(bucket) {
    await this.s3.upload({
      ...uploadParams,
      Bucket: bucket,
      Body: JSON.stringify(INIT_CATALOGUE),
    });
  }
}

module.exports = CatalogueService;
