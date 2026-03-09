require("dotenv").config();
const { exe } = require("./src/config/db");

async function checkCarsTable() {
  try {
    const data = await exe(`
      SELECT 
        c.*,
        COALESCE(cat.name, '-') AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE IFNULL(c.is_active, 1) = 1
     ORDER BY IFNULL(c.is_available, 1) DESC, c.id DESC
    `);
    console.log("Success! Returned " + data.length + " rows.");
  } catch (err) {
    console.error("Query Error:", err);
  } finally {
    process.exit();
  }
}

checkCarsTable();
