var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET home pages. */
router.get('/', function(req, res, next) {
//  res.json({'ary':['3344a','b']});
  res.render('index', { title: 'Express' });
});

module.exports = router;

