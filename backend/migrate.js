require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const { exe } = require("./src/config/db");

async function migrate() {
  try {
    console.log("Starting migration...");

    // 1. Create tours_packages table
    await exe(`
      CREATE TABLE IF NOT EXISTS tours_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        images TEXT, -- JSON array of image paths
        routes TEXT, -- JSON array of route details
        itinerary TEXT,
        inclusions TEXT,
        exclusions TEXT,
        tour_date DATE,
        tour_time TIME,
        status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        created_by INT,
        created_by_role ENUM('ADMIN', 'CAR_REGISTER') DEFAULT 'ADMIN',
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✔ tours_packages table created/exists");

    // 2. Create tour_bookings table
    await exe(`
      CREATE TABLE IF NOT EXISTS tour_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tour_id INT NOT NULL,
        booking_date DATE NOT NULL,
        start_date DATE NOT NULL,
        num_persons INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (tour_id) REFERENCES tours_packages(id)
      )
    `);
    console.log("✔ tour_bookings table created/exists");

    // 3. Update vehicle_type in cars table (removing BUS)
    const carsColumns = await exe("SHOW COLUMNS FROM cars LIKE 'vehicle_type'");
    if (carsColumns.length > 0) {
      await exe("ALTER TABLE cars MODIFY COLUMN vehicle_type ENUM('CAR') DEFAULT 'CAR'");
      console.log("✔ vehicle_type simplified in cars table");
    }

    // 4. Update vehicle_type in car_registration_requests table (removing BUS)
    const reqColumns = await exe("SHOW COLUMNS FROM car_registration_requests LIKE 'vehicle_type'");
    if (reqColumns.length > 0) {
      await exe("ALTER TABLE car_registration_requests MODIFY COLUMN vehicle_type ENUM('CAR') DEFAULT 'CAR'");
      console.log("✔ vehicle_type simplified in car_registration_requests table");
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
