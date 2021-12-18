const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

const localEnvFile = path.join(__dirname, "..", "..", ".env");
const secretEnvFile = path.join(__dirname, "..", "..", "..", ".env.secrets");

function setGlobalEnvFromPath(envPath) {
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing env file, ", envPath);
  }
  const object = dotenv.parse(fs.readFileSync(envPath));

  for (const entry of Object.entries(object)) {
    const key = entry[0];
    if (process.env[key]) {
      // eslint-disable-next-line no-console
      console.log("Conflict for key: ", key);
    }
    process.env[key] = entry[1];
  }
}

/* eslint-disable no-console */
// Set and validate env
module.exports = function setEnv() {
  // Set both local and secret envs to process.env
  setGlobalEnvFromPath(localEnvFile);
  setGlobalEnvFromPath(secretEnvFile);

  const { IMAGE_BREAKPOINTS, AWS_ID, AWS_SECRET, BUCKET_NAME } = process.env;
  let { PORT, SOCKET_PORT, BACKEND_URL, IMAGE_QUALITY, IMAGE_TAGS } =
    process.env;
  // Validate env config
  if (!PORT) {
    PORT = "3000";
  }
  PORT = parseInt(PORT, 10);
  if (!SOCKET_PORT) {
    SOCKET_PORT = "3001";
  }
  SOCKET_PORT = parseInt(SOCKET_PORT, 10);
  if (!BACKEND_URL) {
    BACKEND_URL = "localhost";
    console.log("Defauling to localhost for backend url.");
    process.exit(0);
  }
  if (!IMAGE_BREAKPOINTS) {
    console.log("Please set IMAGE_BREAKPOINTS in .env");
    process.exit(0);
  }
  if (!AWS_ID) {
    console.log("Please set your AWS_ID in .env");
    process.exit(0);
  }
  if (!AWS_SECRET) {
    console.log("Please set your AWS_SECRET in .env");
    process.exit(0);
  }
  if (!BUCKET_NAME) {
    console.log("Please set your BUCKET_NAME in .env");
    process.exit(0);
  }
  if (!IMAGE_QUALITY) {
    console.log("IMAGE_QUALITY not set in .env, defaulting to 90%");
    IMAGE_QUALITY = "90";
  }
  if (!IMAGE_TAGS) {
    const tags =
      // eslint-disable-next-line max-len
      "landscape, nature, sunset, sunrise, portrait, stock, wildlife, animal, urban, architecture, street, night, sky, abstract, black and white, food";
    console.log(`IMAGE_TAGS not set in .env, defaulting to: ${tags}`);
    IMAGE_TAGS = tags;
  }

  return { IMAGE_QUALITY, PORT, SOCKET_PORT, BACKEND_URL };
};
