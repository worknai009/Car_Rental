require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { exe } = require("./src/config/db");

async function run() {
  try {
    await exe("UPDATE tours_packages SET status='APPROVED', is_active=1");
    console.log("All tours approved and activated ✅");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
