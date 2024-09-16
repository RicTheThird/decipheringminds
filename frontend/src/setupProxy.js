// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5228/api',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding the request
      },
    })
  );
};
