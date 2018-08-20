var settings = require('../models/setting').settings

exports.index = function () {
  return {
    settings: settings
  }
}

exports.update = function (req, res) {
  settings.wallet = req.body.wallet
  settings.host = req.body.host
  res.redirect('/settings')
}