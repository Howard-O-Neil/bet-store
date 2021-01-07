import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function (app) {
  //golang backend
  app.use(
    '/go/*',
    createProxyMiddleware({
      target: 'http://10.0.2.2:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/go/': '/',
      },
    }),
  );

  //Java backend api
  app.use(
    '/java/*',
    createProxyMiddleware({
      ws: true,
      target: 'http://10.0.2.2:8085',
      changeOrigin: true,
      pathRewrite: {
        '^/java/': '/',
      },
    }),
  );

  //cdn backend api
  app.use(
    '/cdn/*',
    createProxyMiddleware({
      target: 'http://10.0.2.2:8082',
      changeOrigin: true,
      pathRewrite: {
        '^/cdn/': '/',
      },
    }),
  );

  //nodejs backend
  app.use(
    '/node/*',
    createProxyMiddleware({
      target: 'http://10.0.2.2:8086',
      changeOrigin: true,
      pathRewrite: {
        '^/node/': '/',
      },
    }),
  );
};