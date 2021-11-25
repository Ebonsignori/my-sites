const options = {
  reactStrictMode: true, 
};

// In development use loader in components/image.js
if (process.env.NODE_ENV !== "development") {
  options.images = {
    loader: "custom",
  }
}

module.exports = options;
