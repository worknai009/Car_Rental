const path = require("path");
const fs = require("fs");
const { exe } = require("../../config/db");




exports.addCarRequest = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, "../../../public/uploads/cars");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file) => {
      if (!file) return null;
      const filename = Date.now() + "-" + file.name;
      await file.mv(path.join(uploadDir, filename));
      return `/uploads/cars/${filename}`; // ✅ important
    };

    const cars_image = await saveFile(req.files?.cars_image);
    const rc_book = await saveFile(req.files?.rc_book);
    const insurance_copy = await saveFile(req.files?.insurance_copy);
    const puc_certificate = await saveFile(req.files?.puc_certificate);
    const id_proof = await saveFile(req.files?.id_proof);

    const {
      name,
      brand,
      category_id,
      car_details,
      city,
      year,
      seats,
      fuel_type,
      price_per_day,
      requested_category_id,
    } = req.body;

    await exe(
      `INSERT INTO car_registration_requests
      (car_user_id, name, brand, category_id, car_details, city, year, seats, fuel_type,
       cars_image, requested_category_id, price_per_day,
       rc_book, insurance_copy, puc_certificate, id_proof, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id,
        name,
        brand,
        category_id,
        car_details,
        city,
        year,
        seats,
        fuel_type,
        cars_image,
        requested_category_id,
        price_per_day,
        rc_book,
        insurance_copy,
        puc_certificate,
        id_proof,
        "PENDING",
      ]
    );

    res.json({ message: "Car submitted for admin approval ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit car" });
  }
};

exports.getCategories = async (req, res) => {
  const rows = await exe("SELECT id,name FROM categories WHERE is_active=1");
  res.json(rows);
};

// ✅ GET /car-register/cars/my  (only APPROVED)
exports.getMyCars = async (req, res) => {
  try {
    const rows = await exe(
      `SELECT 
        id,
        car_user_id,
        name,
        brand,
        category_id,
        car_details,
        city,
        year,
        seats,
        fuel_type,
        cars_image,
        requested_category_id,
        approved_category_id,
        price_per_day,
        status,
        admin_remark,
        created_at,
        updated_at
      FROM car_registration_requests
      WHERE car_user_id = ? AND status = 'APPROVED'
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load my cars" });
  }
};

// ✅ GET /car-register/cars/my/all  (ALL statuses)
exports.getMyCarsAll = async (req, res) => {
  try {
    const rows = await exe(
      `SELECT 
        id,
        car_user_id,
        name,
        brand,
        category_id,
        car_details,
        city,
        year,
        seats,
        fuel_type,
        cars_image,
        requested_category_id,
        approved_category_id,
        price_per_day,
        rc_book,
        insurance_copy,
        puc_certificate,
        id_proof,
        status,
        admin_remark,
        created_at,
        updated_at
      FROM car_registration_requests
      WHERE car_user_id = ?
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load my car requests" });
  }
};


exports.getDashboardStats = async (req, res) => {
  try {
    const uid = req.user.id;

    const rows = await exe(
      `SELECT
        COUNT(*) AS total_cars,
        SUM(status = 'APPROVED') AS approved_cars,
        SUM(status = 'PENDING') AS pending_cars,
        SUM(status = 'REJECTED') AS rejected_cars,

        /* total bookings for cars owned by this car-register user */
        (
          SELECT COUNT(*)
          FROM bookings b
          JOIN cars c ON c.id = b.car_id
          WHERE c.car_user_id = ?
        ) AS total_bookings,

        /* revenue: count only PAID + COMPLETED */
        (
          SELECT COALESCE(SUM(b.total_amount), 0)
          FROM bookings b
          JOIN cars c ON c.id = b.car_id
          WHERE c.car_user_id = ?
            AND b.status IN ('PAID', 'COMPLETED')
        ) AS total_revenue

      FROM car_registration_requests
      WHERE car_user_id = ?`,
      [uid, uid, uid]
    );

    const s = rows?.[0] || {};

    res.json({
      total_cars: Number(s.total_cars) || 0,
      approved_cars: Number(s.approved_cars) || 0,
      pending_cars: Number(s.pending_cars) || 0,
      rejected_cars: Number(s.rejected_cars) || 0,
      total_bookings: Number(s.total_bookings) || 0,
      total_revenue: Number(s.total_revenue) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};



// ✅ GET /car-register/bookings/my
exports.getMyBookings = async (req, res) => {
  try {
    const { status } = req.query; // optional filter
    const params = [req.user.id];

    let sql = `
      SELECT
        b.id AS booking_id,
        b.user_id AS customer_user_id,
        b.car_id,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.start_time,
        b.total_amount,
        b.status,
        b.booking_mode,
        b.created_at,

        c.name AS car_name,
        c.brand AS car_brand,
        c.cars_image AS car_image,
        c.price_per_day,
        c.badge,
        c.city AS car_city
      FROM bookings b
      JOIN cars c ON c.id = b.car_id
      WHERE c.car_user_id = ?
    `;

    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY b.id DESC`;

    const rows = await exe(sql, params);
    return res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("getMyBookings error:", err);
    return res.status(500).json({ message: "Failed to load bookings" });
  }
};
