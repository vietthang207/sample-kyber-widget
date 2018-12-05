var express = require('express');
var settingsController = require('../controllers/settingsController');
var paymentsController = require('../controllers/paymentsController');
var router = express.Router();

// router.use(function (req, res, next) {
//   if(req.path != '/txs-json'){
//     paymentsController.updateTxStatus()
//   }
//   next()
// })

router.get('/', function(req, res, next) {
  console.log("run **************** index")
  res.redirect('/books')
});

router.get('/settings', function(req, res, next) {
  res.render('settings', settingsController.index());
});

router.post('/settings', function(req, res, next) {
  settingsController.update(req, res);
});

router.post('/payment/callback', function(req, res, next) {
  paymentsController.pay(req, res);
});

router.get('/payment-info', function(req, res, next) {
  paymentsController.paymentInfo(req, res);
});

router.get('/txs-json', function(req, res, next) {
  paymentsController.currentUserTxsJson(req, res);
});

router.get('/txs', function(req, res, next) {
  paymentsController.currentUserTxs(req, res);
});

router.get('/checkTx', function(req, res, next) {
  console.log("+++++++++++++")
  paymentsController.checkTx(req, res)
});

module.exports = router;
