const { exe } = require("../../config/db");

/* ================= ALL ACTIVE CARS ================= */
exports.getAllCars = async (req, res) => {
  try {
    const data = await exe(`
      SELECT 
        c.*,
        COALESCE(cat.name, '-') AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE IFNULL(c.is_active, 1) = 1
      ORDER BY c.id DESC
    `);

    res.json(data);
  } catch (err) {
    console.error("GET ALL CARS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};

/* ================= AVAILABLE + ACTIVE CARS ================= */
exports.availableCars = async (req, res) => {
  try {
    const data = await exe(`
      SELECT 
        c.*,
        COALESCE(cat.name, '-') AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE IFNULL(c.is_active, 1) = 1
        AND IFNULL(c.is_available, 1) = 1
      ORDER BY c.id DESC
    `);

    res.json(data);
  } catch (err) {
    console.error("AVAILABLE CARS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch available cars" });
  }
};

/* ================= FILTER CARS ================= */
exports.filterCars = async (req, res) => {
  try {
    const {
      category_id,
      brand,
      city,
      fuel_type,
      seats,
      year,
      min_price,
      max_price,
      min_rating,
      available,
    } = req.query;

    let query = `
      SELECT 
        c.*,
        COALESCE(cat.name, '-') AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE IFNULL(c.is_active, 1) = 1
    `;
    const params = [];

    if (category_id) {
      query += " AND c.category_id = ?";
      params.push(category_id);
    }
    if (brand) {
      query += " AND c.brand LIKE ?";
      params.push(`%${brand}%`);
    }
    if (city) {
      query += " AND c.city LIKE ?";
      params.push(`%${city}%`);
    }
    if (fuel_type) {
      query += " AND c.fuel_type = ?";
      params.push(fuel_type);
    }
    if (seats) {
      query += " AND c.seats = ?";
      params.push(seats);
    }
    if (year) {
      query += " AND c.year = ?";
      params.push(year);
    }
    if (min_price) {
      query += " AND c.price_per_day >= ?";
      params.push(min_price);
    }
    if (max_price) {
      query += " AND c.price_per_day <= ?";
      params.push(max_price);
    }
    if (min_rating) {
      query += " AND c.rating >= ?";
      params.push(min_rating);
    }
    if (available === "1") {
      query += " AND IFNULL(c.is_available, 1) = 1";
    }

    query += " ORDER BY c.id DESC";

    const data = await exe(query, params);
    res.json(data);
  } catch (err) {
    console.error("FILTER CARS ERROR:", err);
    res.status(500).json({ message: "Failed to filter cars" });
  }
};

/* ================= ACTIVE CATEGORIES ================= */
exports.getCategories = async (req, res) => {
  try {
    const data = await exe(
      "SELECT * FROM categories WHERE is_active=1 ORDER BY id DESC"
    );
    res.json(data);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

/* ================= CAR BY ID ================= */
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await exe(
      `
      SELECT 
        c.*,
        COALESCE(cat.name, '-') AS category_name
      FROM cars c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.id=? AND IFNULL(c.is_active, 1) = 1
      `,
      [id]
    );

    if (!data.length) return res.status(404).json({ message: "Car not found" });

    res.json(data[0]);
  } catch (err) {
    console.error("GET CAR BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to fetch car" });
  }
};

/* ================= CAR REVIEWS ================= */
exports.getCarReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await exe(
      `
      SELECT f.*, u.name AS user_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.booking_id IN (
        SELECT id FROM bookings WHERE car_id=?
      )
      ORDER BY f.id DESC
      `,
      [id]
    );

    res.json(data);
  } catch (err) {
    console.error("CAR REVIEWS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch car reviews" });
  }
};
