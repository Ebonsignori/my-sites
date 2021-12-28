const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

const secretEnvFile = path.join(__dirname, "..", "..", ".env.secrets");
let secrets;
if (fs.existsSync(secretEnvFile)) {
  secrets = dotenv.parse(fs.readFileSync(secretEnvFile));
}

const accessKeyId = process.env.AWS_ID || secrets?.AWS_ID;
const secretAccessKey = process.env.AWS_SECRET || secrets?.AWS_SECRET;

console.log(accessKeyId)

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

async function getCatalogue() {
  const getRes = await s3
    .getObject({
      Bucket: "evan-bio-photos",
      Key: "catalogue.json",
    })
    .promise();
  return JSON.parse(getRes.Body.toString());
}

const cataloguePath = path.join(__dirname, "..", "catalogue.json");

async function main() {
  const newCatalogue = await getCatalogue();
  fs.writeFileSync(cataloguePath, JSON.stringify(newCatalogue, null, 2));
  // eslint-disable-next-line no-console
  console.log("Catalogue.json Updated.");
  return 0;
}

main();
