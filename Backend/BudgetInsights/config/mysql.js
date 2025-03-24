const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
const db = mysql.createPool({
  host: "localhost", // Change if using a different DB host
  user: "root",
  password: "manisha@11",
  database: "taxsavvy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const initializeDatabase = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to MySQL Database!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error);
    process.exit(1); // Exit if DB connection fails
  }
};

module.exports = { db, initializeDatabase };
