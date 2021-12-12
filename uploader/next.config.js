/* eslint-disable filenames/match-regex */
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const withTM = require("next-transpile-modules")(["../shared"]);

const env = dotenv.parse(fs.readFileSync(path.join(__dirname, ".env")));

const options = {
  reactStrictMode: true,
  env,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withTM(options);
