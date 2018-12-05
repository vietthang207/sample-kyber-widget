var Book = require('../models/book')
var settings = require('../models/setting').settings

exports.index = function (req, res) {
  Book.all().then(data => {
    res.render('books/index', {
      listBook: data,
      settings: settings
    })
  })
}

exports.show = function (req, res) {
  Book.find(req.params.id).then(book => {
    res.render('books/show', {
      book: book,
      settings: settings
    })
  })
}
