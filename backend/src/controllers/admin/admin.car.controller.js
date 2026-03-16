


const path = require("path");
const fs = require("fs");
const { exe } = require("../../config/db");

exports.createCar = async (req, res) => {
  try {
    // ✅ file check
    if (!req.files || !req.files.cars_image) {
      return res.status(400).json({ message: "Car image is required" });
    }

    const img = req.files.cars_image;

    // ✅ ensure public folder exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    // ✅ unique filename
    const fileName = `${Date.now()}_${img.name.replace(/\s+/g, "")}`;
    const uploadPath = path.join(publicDir, fileName);

    await img.mv(uploadPath);

    // ✅ body fields
    const {
      name,
      brand,
      car_details,
      category_id,
      price_per_day,
      price_per_km, 
      is_available,
      city,
      year,
      seats,
      fuel_type,
      rating,
      badge,
      vehicle_type,
    } = req.body;

    // ✅ insert
    await exe(
      `INSERT INTO cars 
      (name, brand, car_details, cars_image, category_id, vehicle_type, price_per_day, price_per_km, is_available, city, year, seats, fuel_type, rating, badge, is_active, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,NOW())`,
      [
        name,
        brand,
        car_details || "",
        fileName,
        Number(category_id),
        vehicle_type || "CAR",
        Number(price_per_day),
        Number(price_per_km),
        Number(is_available ?? 1),
        city || "",
        year ? Number(year) : null,
        seats ? Number(seats) : null,
        fuel_type || "Petrol",
        rating === "" || rating == null ? 0 : Number(rating),
        badge || "",
      ]
    );

    res.json({ message: "Car added successfully ✅" });
  } catch (err) {
    console.error("CREATE CAR ERROR:", err);
    res.status(500).json({ message: "Failed to add car" });
  }
};


// ✅ GET ALL CARS (with category name)
exports.getCars = async (req, res) => {
  try {
    const cars = await exe(`
      SELECT 
        c.*, cat.name AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.is_active = 1
      ORDER BY c.id DESC
    `);

    res.json(cars);
  } catch (err) {
    console.error("GET CARS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};


// ✅ GET SINGLE CAR (for Edit page)
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await exe("SELECT * FROM cars WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Car not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET CAR ERROR:", err);
    res.status(500).json({ message: "Failed to fetch car" });
  }
};

// ✅ UPDATE CAR (Edit)
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    // keep old image if no new image
    let imageName = null;
    if (req.files?.cars_image) {
      const image = req.files.cars_image;
      imageName = Date.now() + "_" + image.name;
      await image.mv("public/" + imageName);
    } else {
      const old = await exe("SELECT cars_image FROM cars WHERE id=?", [id]);
      imageName = old[0]?.cars_image || null;
    }

    const {
      name,
      brand,
      car_details,
      category_id,
      price_per_day,
      price_per_km,
      is_available,
      city,
      year,
      seats,
      fuel_type,
      rating,
      badge,
      vehicle_type,
    } = req.body;

    await exe(
      `UPDATE cars SET
        name=?,
        brand=?,
        car_details=?,
        cars_image=?,
        category_id=?,
        price_per_day=?,
        price_per_km=?,
        is_available=?,
        city=?,
        year=?,
        seats=?,
        fuel_type=?,
        rating=?,
        badge=?,
        vehicle_type=?
      WHERE id=?`,
      [
        name,
        brand,
        car_details || "",
        imageName,
        category_id,
        price_per_day,
        price_per_km,
        Number(is_available ?? 1),
        city || "",
        year || null,
        seats || null,
        fuel_type || "",
        rating || null,
        badge || "",
        vehicle_type || "CAR",
        id,
      ]
    );

    res.json({ message: "Car updated successfully" });
  } catch (err) {
    console.error("UPDATE CAR ERROR:", err);
    res.status(500).json({ message: "Failed to update car" });
  }
};

// ✅ DELETE CAR (safe: handle FK constraint like bookings)
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await exe("UPDATE cars SET is_active=0 WHERE id=?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json({ message: "Car removed successfully (soft delete) ✅" });
  } catch (err) {
    console.error("SOFT DELETE CAR ERROR:", err);
    res.status(500).json({ message: "Failed to delete car" });
  }
};

