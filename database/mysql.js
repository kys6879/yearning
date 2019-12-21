const mysql = require('mysql');

const connection = mysql.createConnection({
  "host": "13.125.241.39",
  "user": "root",
  "password": "u*fcqUJ<6Ju\"v`*U",
  "database": "mmstory"
});

module.exports = {
  connection: connection,
};