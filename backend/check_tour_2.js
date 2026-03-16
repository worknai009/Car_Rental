require('dotenv').config({path:'./.env'});
const { exe } = require('./src/config/db');

async function check() {
  try {
    const rows = await exe('SELECT * FROM tours_packages WHERE id=2');
    console.log(JSON.stringify(rows[0], null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
