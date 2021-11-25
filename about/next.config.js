const options = {
  reactStrictMode: true, 
};

if (process.env.NODE_ENV !== "development") {
  options.loader = ({ src, width, quality }) => {
    return `https://ebonsignori.github.io/my-about/images/${src}`
  }
}

module.exports = options;
