/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import prompts from "prompts";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const args = yargs(hideBin(process.argv)).argv;

const entryPath = path.join(process.cwd(), "entries");

const datePart = new Date().toISOString().split("T")[0];

async function main() {
  // Validate and prompt for args not passed
  await checkRequestArg("title");
  await checkRequestArg("slug", true);
  await checkRequestArg("categories");
  await checkRequestArg("preview");
  await checkRequestArg("keywords");
  await checkRequestArg("image");
  await checkRequestArg("imageAlt");
  await checkRequestArg("imageCaption");
  if (
    !args.title ||
    !args.slug ||
    !args.categories ||
    !args.preview ||
    !args.keywords ||
    !args.image ||
    !args.imageAlt
  ) {
    return console.log("Not creating new post.");
  }

  return createPost(args);
}

const validSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g;

async function checkRequestArg(argName, isSlug) {
  if (!args[argName]) {
    const { res } = await prompts({
      name: "res",
      message: `${argName}`,
      type: "text",
      validate: (value) => {
        if (!value) {
          return `${argName} required`;
        }
        if (isSlug && !validSlugRegex.test(value)) {
          return `Not a valid slug`;
        }
        return true;
      },
    });
    args[argName] = res;
  }
}

export function createPost(postArgs) {
  const filename = `${datePart}-${postArgs.title.replace(/\s/g, "-")}.mdx`;
  const filepath = path.join(entryPath, filename);

  fs.writeFileSync(
    filepath,
    `---
title: ${postArgs.title}
slug: ${postArgs.slug}
categories: ${postArgs.categories}
date: ${postArgs.date || datePart}
image: ${postArgs.image}
imageAlt: ${postArgs.imageAlt}${
      postArgs.imageCaption ? `\nimageCaption: ${postArgs.imageCaption}` : ""
    }
---

${postArgs.preview}<!-- end-preview -->

${postArgs.body ? postArgs.body : ""}`
  );

  console.log(`Created new entry, ${filepath}`);
}

// Called as entry file
if (process.argv[1].includes("new-post.mjs")) {
  main();
}
