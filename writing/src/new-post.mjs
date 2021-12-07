/* eslint-disable no-console */
/* eslint-disable i18n-text/no-en */
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
  await checkRequestArg("category");
  await checkRequestArg("preview");
  if (!args.title || !args.slug || !args.category || !args.preview) {
    return console.log("Not creating new post.");
  }

  const filename = `${datePart}-${args.title.replace(/\s/g, "-")}.mdx`;
  const filepath = path.join(entryPath, filename);

  fs.writeFileSync(
    filepath,
    `---
title: ${args.title}
slug: ${args.slug}
category: ${args.category}
date: ${datePart}
preview: ${args.preview}
---`
  );

  console.log(`Created new entry, ${filepath}`);
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

main();
