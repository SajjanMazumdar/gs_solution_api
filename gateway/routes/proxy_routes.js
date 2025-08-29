const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

function fixRedirect(serviceName) {
  return (proxyRes) => {
    const loc = proxyRes.headers['location'];
    if (loc && loc.includes('localhost')) {
      // console.log(`⚠️ Rewriting redirect from ${loc}`);
      proxyRes.headers['location'] = loc.replace(/http:\/\/localhost:\d+/, `/api/${serviceName}`);
    }
  };
}
// Login Service Proxy
router.use('/login', createProxyMiddleware({
  target: process.env.LOGIN_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/login': '' },
  followRedirects: true,
  onProxyRes: fixRedirect('login'),
}));

// Master Service Proxy
router.use('/master', createProxyMiddleware({
  target: process.env.MASTER_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/master': '' },
  followRedirects: true,
  onProxyRes: fixRedirect('master'),
}));

module.exports = router;
