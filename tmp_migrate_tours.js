const mysql = require("./backend/node_modules/mysql");
const util = require("util");
require("dotenv").config({ path: "./backend/.env" });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

const exe = util.promisify(connection.query).bind(connection);

async function migrate() {
  console.log("Connecting to database...");
  
  try {
    console.log("Adding tour_date and tour_time columns to tours_packages...");
    
    // Check if columns exist
    const columns = await exe("DESCRIBE tours_packages");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('tour_date')) {
      await exe("ALTER TABLE tours_packages ADD COLUMN tour_date DATE AFTER exclusions");
      console.log("Added tour_date.");
    }
    
    if (!columnNames.includes('tour_time')) {
      await exe("ALTER TABLE tours_packages ADD COLUMN tour_time TIME AFTER tour_date");
      console.log("Added tour_time.");
    }
    
    console.log("Success! Database updated.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    connection.end();
  }
}

migrate();
