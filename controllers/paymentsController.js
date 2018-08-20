var Book = require('../models/book')
var Tx = require('../models/txs')
var settings = require('../models/setting').settings
var txChecker = null

exports.pay = function (req, res) {
  console.log(req.body)
  data = JSON.parse(req.body)

  Tx.insert({
    hash: data.tx,
    payment_token: data.paymentToken,
    book_id: data.bookId
  })
}

exports.paymentInfo = function (req, res) {
  Book.find(req.query.bookId).then(book => {
    res.render('payment/payment-info', {
      book: book,
      settings: settings
    })
  })
}

exports.currentUserTxsJson = function (req, res) {
  Tx.findBy({payment_token: req.query.paymentToken}).then(data => {
    res.send(data)
  })
}

exports.currentUserTxs = function (req, res) {
  Tx.currentUserTxs({paymentToken: req.query.paymentToken}).then(txs => {
    res.render('payment/txs', {
      txs: txs,
      settings: settings
    })
  })
}

exports.updateTxStatus = function (req, res) {
  if(!txChecker){
    txChecker = setInterval(() => {
      console.log('Time:', Date.now())
    }, 1000)
  }
}
