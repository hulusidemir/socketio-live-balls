var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Live Balls' });
});

/* GET ENV PAge */
router.get('/getEnv', function(req, res, next) {
  const envData =  require('../config/env')[process.env.NODE_ENV || 'development'];
  res.json(envData);
});


module.exports = router;
