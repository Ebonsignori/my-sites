const https = require("https");
const fs = require("fs");
const path = require("path");

// Not in .env or shell to make running in GH action easier
const catalogueUrl = "https://diy6d7dnpy1l6.cloudfront.net/catalogue.json";

async function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        reject(error);
      });
  });
}

const cataloguePath = path.join(__dirname, "..", "catalogue.json");

async function main() {
  const newCatalogue = await getJson(catalogueUrl);
  fs.writeFileSync(cataloguePath, JSON.stringify(newCatalogue, null, 2));
  // eslint-disable-next-line no-console
  console.log("Catalogue.json Updated.");
  return 0;
}

main();
