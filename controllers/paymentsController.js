var Web3 = require('web3')
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
  Tx.findBy({ payment_token: req.query.paymentToken }).then(data => {
    res.send(data)
  })
}

exports.currentUserTxs = function (req, res) {
  Tx.currentUserTxs({ paymentToken: req.query.paymentToken }).then(txs => {
    txs.forEach(tx => {
      switch (tx.status) {
        case 0:
          tx.status = 'pending'
          break
        case 1:
          tx.status = 'success'
          break
        case 2:
          tx.status = 'fail'
          break
      }
    })
    res.render('payment/txs', {
      txs: txs,
      settings: settings
    })
  })
}

exports.updateTxStatus = function (req, res) {
  let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
  if (!txChecker) {
    txChecker = setInterval(() => {
      console.log('Time:', Date.now())
      Tx.pendingTx().then(data => {
        data.forEach(tx => {
          web3.eth.getTransactionReceipt(tx.hash, (err, result) => {
            if (result) {
              Tx.updateTxStatus({ hash: tx.hash, status: result.status ? 1 : 2 })
            }
            console.log('result: ', result)
          })
        });
      })
    }, 10000)
  }
}
