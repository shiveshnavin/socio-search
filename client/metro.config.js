// metro.config.js

const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Set Cross-Origin Resource Sharing (CORS) headers
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allows all domains
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader("cross-origin-resource-policy", "cross-origin");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      // Set Cross-Origin-Resource-Policy (CORP) header
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

      // Call the next middleware in the chain
      middleware(req, res, next);
    };
  },
};

module.exports = config;
