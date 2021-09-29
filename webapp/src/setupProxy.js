const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(createProxyMiddleware('/api/', {
    target: 'http://10.1.3.197:3000',
    changeOrigin : true,
    pathRewrite : {
      '^/api/' : '/api/'
    },
  }));
};