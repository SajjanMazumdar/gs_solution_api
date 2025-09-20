const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "🚀 API Gateway is running",
  });
});

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

// Dispatch Service Proxy
router.use('/dispatch', createProxyMiddleware({
  target: process.env.DISPATCH_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/dispatch': '',
  },
}));

module.exports = router;
