const mysql = require("mysql2/promise");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const db = mysql.createPool({
  host: process.env.DB_HOST|| "localhost",
  user: process.env.DB_USER||"root",
  password: process.env.DB_PASSWORD||"manisha@11",
  database: process.env.DB_NAME||"taxsavvy",
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10, // Convert to number
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
