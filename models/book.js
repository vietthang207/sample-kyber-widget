var model = require('./model');

class Book{
  constructor(model){
    this.db = model
  }

  all(){
    let sql = `SELECT * FROM books`
    return new Promise((resolve) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) throw err
        resolve(rows)
      })
    })
  }

  find(id){
    let sql = `SELECT * FROM books where id = ${id}`
    return new Promise((resolve) => {
      this.db.get(sql, [], (err, rows) => {
        if (err) throw err
        resolve(rows)
      })
    })
  }
}

module.exports = new Book(model.db);