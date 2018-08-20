var sqlite3 = require('sqlite3').verbose();

class Model{
  constructor(){
    this.db = new sqlite3.Database('./db/database.sqlite3', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database.sqlite3 database.');
    });
  }
}

module.exports = new Model()