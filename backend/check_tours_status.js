require("dotenv").config();
const { exe } = require("./src/config/db");

async function checkTours() {
  try {
    const rows = await exe("SELECT id, title, status, is_active FROM tours_packages");
    console.log("Total Tours:", rows.length);
    console.log("Active & Approved:", rows.filter(r => r.is_active == 1 && r.status === 'APPROVED').length);
    console.table(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTours();
