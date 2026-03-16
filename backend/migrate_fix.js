require("dotenv").config();
const { exe } = require("./src/config/db");

async function migrate() {
  console.log("Checking tours_packages schema...");
  try {
    const columns = await exe("DESCRIBE tours_packages");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('tour_date')) {
      await exe("ALTER TABLE tours_packages ADD COLUMN tour_date DATE AFTER exclusions");
      console.log("✅ Added tour_date column");
    } else {
      console.log("ℹ️ tour_date column already exists");
    }
    
    if (!columnNames.includes('tour_time')) {
      await exe("ALTER TABLE tours_packages ADD COLUMN tour_time TIME AFTER tour_date");
      console.log("✅ Added tour_time column");
    } else {
      console.log("ℹ️ tour_time column already exists");
    }
    
    console.log("🚀 Database schema is up to date!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    process.exit();
  }
}

migrate();
