const { csvStrToArray } = require("./misc");

const CATALOGUE = "catalogue.json";
const INIT_CATALOGUE = {
  tags: [],
  breakpoints: [csvStrToArray("IMAGE_BREAKPOINTS")],
  models: [],
  images: [],
};
const uploadParams = {
  ContentType: "application/json",
  ContentLanguage: "en-US",
  Key: CATALOGUE,
};

class CatalogueService {
  static CATALOGUE = "catalogue.json";

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
    // Add any new tags to top-level catalogue tags for site filtering
    for (const tag of obj.tags) {
      if (!newCatalogue.tags.includes(tag)) {
        newCatalogue.tags.push(tag);
      }
    }
    // Add any new models to top-level catalogue models for site filtering
    if (!newCatalogue.models.includes(obj.model)) {
      newCatalogue.models.push(obj.model);
    }
    newCatalogue.images = [...newCatalogue.images, obj];
    this.catalogue = newCatalogue;
    return this.replaceCatalogue(bucket, newCatalogue);
  }

  async removeFromCatalogue(bucket, slug) {
    await this.getCatalogue(bucket);
    const newCatalogue = { ...this.catalogue };
    const foundImage = newCatalogue.images.find((image) => image.slug === slug);
    if (!foundImage) {
      throw Error(`No image in catalogue with slug: ${slug}`);
    }
    newCatalogue.images = newCatalogue.images.filter(
      (image) => image.slug !== slug
    );
    this.catalogue = newCatalogue;
    const updateRes = await this.replaceCatalogue(bucket, newCatalogue);
    // After deleting item, sync top-level fields
    return {
      updateRes,
      deletedObj: foundImage,
      catalogue: await this.syncCatalogue(bucket),
    };
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

  // Sync top-level tags and models using data of all images in the catalogue
  async syncCatalogue(bucket) {
    await this.getCatalogue(bucket);
    const tags = {};
    const models = {};
    for (const image of this.catalogue.images) {
      for (const tag of image.tags) {
        if (!tags[tag]) {
          tags[tag] = true;
        }
      }
      if (!models[image.model]) {
        models[image.model] = true;
      }
    }
    const newCatalogue = { ...this.catalogue };
    newCatalogue.tags = Object.keys(tags);
    newCatalogue.models = Object.keys(models);
    this.catalogue = newCatalogue;
    await this.replaceCatalogue(bucket, newCatalogue);
    return this.catalogue;
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
