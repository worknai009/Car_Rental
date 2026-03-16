const mysql = require("mysql");
const util = require("util");
const { Sequelize } = require("sequelize");

// 1. RAW CONNECTION (Backward Compatibility)
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

conn.connect((err) => {
  if (err) {
    console.error("DB CONNECT ERROR (RAW):", err.code, err.sqlMessage);
  } else {
    console.log("DB CONNECTED (RAW) ✅");
  }
});

const exe = util.promisify(conn.query).bind(conn);

// 2. SEQUELIZE INITIALIZATION
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Set to console.log if you want to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const testSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB CONNECTED (SEQUELIZE) ✅");
  } catch (error) {
    console.error("DB CONNECT ERROR (SEQUELIZE):", error.message);
  }
};
testSequelize();

module.exports = { conn, exe, sequelize };

