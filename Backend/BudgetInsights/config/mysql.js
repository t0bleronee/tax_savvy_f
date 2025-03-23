const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",        // Change if using a cloud DB
  user: "root",             // Your MySQL username
  password: "qwerty123$",   // Your MySQL password
  database: "TaxSavvy",     // The database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
