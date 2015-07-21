var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* GET install page. */
router.get('/', function(req, res, next) {

  var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
  var db = new mongodb.Db('share', mongodbServer);



    /* open db */
    db.open(function() {
        /* Select 'contact' collection */
        db.collection('admin', function(err, collection) {
            /* Insert a data */
            collection.insert({
                name: 'sunzhen',
                email: 'csunzhen@gmail.com',
                pwd: '12345678'
            }, function(err, data) {
                if (data) {
                    console.log('Successfully Insert');
                } else {
                    console.log('Failed to Insert');
                }
            });

        });
    });











  res.render('install', { title: 'install Express 4' });
});

module.exports = router;

