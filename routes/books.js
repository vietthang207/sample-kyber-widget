var express = require('express');
var booksController = require('../controllers/booksController');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("________ index")
  booksController.index(req, res)
});

router.get('/:id', function(req, res, next) {
  booksController.show(req, res)
});


module.exports = router;
