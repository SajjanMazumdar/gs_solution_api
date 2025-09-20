var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Gateway' });
  res.json({
    success: true,
    message: "API Gateway is running"
  });
});

module.exports = router;
