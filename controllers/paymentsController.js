var Web3 = require('web3')
var Book = require('../models/book')
var Tx = require('../models/txs')
var settings = require('../models/setting').settings
var txChecker = null

var monitorTx = require("monitor-tx")
monitorTx.init({
  // nodes: ['https://ropsten.infura.io'],
  // network: 'ropsten'/'mainnet'/'kovan',
  // expression: "* * * * *"
  // blockConfirm: 30,
  // lostTimeout: 300,
  // getReceipt: true
  // txs
})

const monitorCallback = (err, result) => {
  console.log("-----------", err, result)
  if(!err && !result.pending){
    Tx.updateTx(result.hash, {block_confirm: result.confirmBlock})
  }
  
}

const finishMonitorCallback = (err, result) => {
  console.log("=====++++++++done+=============================", err, result)
  var status = 0
  switch(result.status){
    case 'success':
      status = 1
      break
    case 'fail':
      status = 2
      break
    case 'lost':
      status = 3
      break
  }
  if(!err && !result.pending){
    Tx.updateTx(result.hash, { status: status, block_confirm: result.confirmBlock })
  }
}

exports.pay = function (req, res) {

  data = req.body

  Tx.insert({
    hash: data.tx,
    payment_token: data.paymentToken,
    book_id: data.bookId
  })
  monitorTx.addTx({
    hash: data.tx,
    callback: monitorCallback,
    finishCallback: finishMonitorCallback,
    // blockConfirm: 30
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
        case 3:
          tx.status = 'lost'
          break
      }
    })
    res.render('payment/txs', {
      txs: txs,
      settings: settings
    })
  })
}

// exports.updateTxStatus = function (req, res) {
//   let web3 = new Web3(new Web3.providers.HttpProvider(settings.node));
//   if (!txChecker) {
//     txChecker = setInterval(() => {
//       console.log('Time:', Date.now())
//       Tx.pendingTx().then(data => {
//         data.forEach(tx => {
//           web3.eth.getTransactionReceipt(tx.hash, (err, result) => {
//             if (result) {
//               Tx.updateTxStatus({ hash: tx.hash, status: result.status ? 1 : 2 })
//             }
//             console.log('result: ', result)
//           })
//         });
//       })
//     }, 10000)
//   }
// }
