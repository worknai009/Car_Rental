const mysql = require("mysql");
const util = require("util");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

conn.connect((err) => {
  if (err) {
    console.error("DB CONNECT ERROR:", err.code, err.sqlMessage);
  } else {
    console.log("DB CONNECTED ✅");
  }
});

const exe = util.promisify(conn.query).bind(conn);
module.exports = { conn, exe };
