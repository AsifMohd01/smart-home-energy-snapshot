const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  
  console.log('Connected to the database as ID', connection.threadId);
  connection.release();  // Release the connection back to the pool
});

module.exports = pool; // Export the pool if needed elsewhere



