import faker from "faker";

import { createPost } from "../src/new-post.mjs";

const CATEGORIES = new Array(6).fill().map(() => faker.lorem.word());
const IMAGE_OPTS = [
  "imageUrl",
  "cats",
  "abstract",
  "animals",
  "business",
  "city",
  "food",
  "nightlife",
  "fashion",
  "people",
  "nature",
  "sports",
  "technics",
  "transport",
];
const NUMBER_OF_POSTS = IMAGE_OPTS.length;

for (let i = 0; i < NUMBER_OF_POSTS; i++) {
  const numOfCategories = getRandomIntBetween(1, 3);
  let categoryOpts = [...CATEGORIES];
  const categories = [];
  for (let j = 0; j < numOfCategories; j++) {
    const index = getRandomIntBetween(0, categoryOpts.length - 1);
    const removedElement = categoryOpts.slice(index, index + 1);
    categoryOpts = categoryOpts.filter((el) => el !== removedElement);
    categories.push(removedElement);
  }
  const date = faker.datatype.datetime().toISOString().split("T")[0];

  createPost({
    title: faker.lorem.words(getRandomIntBetween(1, 5)),
    slug: faker.lorem.slug(),
    categories: categories.join(", "),
    date,
    image: faker.image[IMAGE_OPTS[i]](),
    imageAlt: faker.lorem.sentence(),
    imageCaption: faker.lorem.sentence(),
    preview: faker.lorem.sentences(3),
    body: faker.lorem.paragraphs(getRandomIntBetween(4, 11)),
  });
}

function getRandomIntBetween(min, max) {
  max -= 1;
  return Math.floor(Math.random() * (max - min + 1) + min) + 1;
}
