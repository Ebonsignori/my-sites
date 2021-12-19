/* eslint-disable filenames/match-regex */
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const setEnv = require("./server/utils/set-env");
const withTM = require("next-transpile-modules")(["../shared"]);

const env = dotenv.parse(fs.readFileSync(path.join(__dirname, ".env")));

const { GOOGLE_MAPS_API_KEY } = setEnv();

const options = {
  reactStrictMode: true,
  env: {
    ...env,
    GOOGLE_MAPS_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withTM(options);
