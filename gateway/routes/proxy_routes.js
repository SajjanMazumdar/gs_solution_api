const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Login Service Proxy
router.use('/login', createProxyMiddleware({
  target: process.env.LOGIN_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/login': '',
  },
}));

// Master Service Proxy
router.use('/master', createProxyMiddleware({
  target: process.env.MASTER_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/master': '',
  },
}));

module.exports = router;
