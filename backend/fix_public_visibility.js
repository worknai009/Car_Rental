require("dotenv").config();
const { exe } = require("./src/config/db");

async function fixTours() {
  try {
    const res = await exe("UPDATE tours_packages SET status='APPROVED', is_active=1");
    console.log("Updated Tours:", res.affectedRows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixTours();
