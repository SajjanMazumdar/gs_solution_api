var express = require('express');
var router = express.Router();
const logger = require('../logs/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

module.exports = router;
