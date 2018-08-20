var model = require('./model');

class Tx {
  constructor(model) {
    this.db = model
  }

  findBy(data) {
    let sql = `SELECT * FROM txs`
    if (Object.keys(data).length > 0) {
      let i = 0
      for (let key in data) {
        if (i == 0) {
          sql += ` WHERE ${key} = "${data[key]}"`
        }else{
          sql += ` AND ${key} = "${data[key]}"`
        }
        i++
      }
    }
    return new Promise((resolve) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) throw err
        resolve(rows)
      })
    })
  }

  insert(data) {
    let columns = Object.keys(data).join(',')
    let columns_mask = new Array(Object.keys(data).length + 1).join('?').split('').join(',')

    let values = Object.values(data)

    let sql = `INSERT INTO txs(${columns}) VALUES (${columns_mask})`
    return new Promise((resolve) => {
      this.db.run(sql, values, function (err) {
        if (err) throw err
        console.log(this)
        resolve({ id: this.lastID })
      })
    })
  }

  currentUserTxs(data){
    let sql = `SELECT * FROM txs INNER JOIN books on books.id = txs.book_id WHERE txs.payment_token = ?`
    return new Promise((resolve) => {
      this.db.all(sql, [data.paymentToken], (err, rows) => {
        if (err) throw err
        resolve(rows)
      })
    })
  }
}

module.exports = new Tx(model.db);