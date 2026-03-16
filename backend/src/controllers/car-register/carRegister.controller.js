const path = require("path");
const fs = require("fs");
const { exe } = require("../../config/db");




exports.addCarRequest = async (req, res) => {
  try {
    // ✅ basic check
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ ensure folder
    const uploadDir = path.join(__dirname, "../../../public/uploads/cars");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file) => {
      if (!file) return null;
      const filename = Date.now() + "-" + file.name;
      await file.mv(path.join(uploadDir, filename));
      return `/uploads/cars/${filename}`;
    };

    // ✅ IMPORTANT: if files missing, express-fileupload will give undefined
    if (!req.files?.cars_image) {
      return res.status(400).json({ message: "Car image is required" });
    }

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
      price_per_km,
      requested_category_id,
      vehicle_type,
    } = req.body;

    // ✅ optional: validation
    if (!name || !brand || !category_id || !requested_category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ FIX: 18 placeholders now ✅
    await exe(
      `INSERT INTO car_registration_requests
      (car_user_id, name, brand, category_id, vehicle_type, car_details, city, year, seats, fuel_type,
       cars_image, requested_category_id, price_per_day, price_per_km,
       rc_book, insurance_copy, puc_certificate, id_proof, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id,
        name,
        brand,
        category_id,
        vehicle_type || "CAR",
        car_details || null,
        city || null,
        year || null,
        seats || null,
        fuel_type || null,
        cars_image,
        requested_category_id,
        price_per_day || null,
        price_per_km || null,
        rc_book,
        insurance_copy,
        puc_certificate,
        id_proof,
        "PENDING",
      ]
    );

    return res.json({ message: "Car submitted for admin approval ✅" });
  } catch (err) {
    console.error("addCarRequest error:", err);
    return res.status(500).json({ message: err?.message || "Failed to submit car" });
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
        price_per_km,
        status,
        vehicle_type,
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
        price_per_km,
        rc_book,
        vehicle_type,
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
        ) AS total_revenue,

        /* tour packages count */
        (
          SELECT COUNT(*)
          FROM tours_packages
          WHERE created_by = ? AND created_by_role = 'CAR_REGISTER'
        ) AS total_tour_packages,

        /* tour bookings count */
        (
          SELECT COUNT(*)
          FROM tour_bookings tb
          JOIN tours_packages tp ON tb.tour_id = tp.id
          WHERE tp.created_by = ? AND tp.created_by_role = 'CAR_REGISTER'
        ) AS total_tour_bookings

      FROM car_registration_requests
      WHERE car_user_id = ?`,
      [uid, uid, uid, uid, uid]
    );

    const s = rows?.[0] || {};

    res.json({
      total_cars: Number(s.total_cars) || 0,
      approved_cars: Number(s.approved_cars) || 0,
      pending_cars: Number(s.pending_cars) || 0,
      rejected_cars: Number(s.rejected_cars) || 0,
      total_bookings: Number(s.total_bookings) || 0,
      total_revenue: Number(s.total_revenue) || 0,
      total_tour_packages: Number(s.total_tour_packages) || 0,
      total_tour_bookings: Number(s.total_tour_bookings) || 0,
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
        c.price_per_km,
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


// ✅ EDIT + DELETE in BOTH tables: car_registration_requests + cars
// NOTE: cars table has car_request_id (links to car_registration_requests.id)

const ensureCarsUploadDir = () => {
  const uploadDir = path.join(__dirname, "../../../public/uploads/cars");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
};

const saveCarFile = async (file) => {
  if (!file) return null;
  const uploadDir = ensureCarsUploadDir();
  const filename = Date.now() + "-" + file.name;
  await file.mv(path.join(uploadDir, filename));
  return `/uploads/cars/${filename}`;
};

const unlinkIfExists = (publicPath) => {
  try {
    if (!publicPath) return;
    // stored like "/uploads/cars/abc.jpg"
    const p = String(publicPath).replace(/\\/g, "/");
    const abs = path.join(__dirname, "../../../public", p.startsWith("/") ? p : "/" + p);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (e) {
    // ignore file delete error
  }
};

// ✅ PUT /car-register/cars/:id
exports.updateCarBothTables = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const carUserId = req.user?.id;

    if (!carUserId) return res.status(401).json({ message: "Unauthorized" });
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    // ✅ check request exists + belongs to this user
    const reqRows = await exe(
      `SELECT * FROM car_registration_requests WHERE id=? AND car_user_id=? LIMIT 1`,
      [id, carUserId]
    );

    if (!reqRows || reqRows.length === 0) {
      return res.status(404).json({ message: "Car request not found" });
    }

    const oldReq = reqRows[0];

    // ✅ optional file updates
    const newCarsImage = await saveCarFile(req.files?.cars_image);
    const newRcBook = await saveCarFile(req.files?.rc_book);
    const newInsurance = await saveCarFile(req.files?.insurance_copy);
    const newPuc = await saveCarFile(req.files?.puc_certificate);
    const newIdProof = await saveCarFile(req.files?.id_proof);

    // ✅ allowed fields from body
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
      price_per_km,
      requested_category_id,
      vehicle_type,
    } = req.body;

    // ✅ Build update for car_registration_requests
    const setReq = [];
    const paramsReq = [];

    const addReqField = (col, val) => {
      if (val === undefined) return;
      setReq.push(`${col}=?`);
      paramsReq.push(val);
    };

    addReqField("name", name);
    addReqField("brand", brand);
    addReqField("category_id", category_id);
    addReqField("requested_category_id", requested_category_id ?? category_id);
    addReqField("car_details", car_details);
    addReqField("city", city);
    addReqField("year", year);
    addReqField("seats", seats);
    addReqField("fuel_type", fuel_type);
    addReqField("price_per_day", price_per_day);
    addReqField("price_per_km", price_per_km);
    addReqField("vehicle_type", vehicle_type);

    if (newCarsImage) addReqField("cars_image", newCarsImage);
    if (newRcBook) addReqField("rc_book", newRcBook);
    if (newInsurance) addReqField("insurance_copy", newInsurance);
    if (newPuc) addReqField("puc_certificate", newPuc);
    if (newIdProof) addReqField("id_proof", newIdProof);

    if (setReq.length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // ✅ update request table
    await exe(
      `UPDATE car_registration_requests SET ${setReq.join(", ")}, updated_at=NOW() WHERE id=? AND car_user_id=?`,
      [...paramsReq, id, carUserId]
    );

    // ✅ update cars table also (only columns that exist there)
    const setCars = [];
    const paramsCars = [];

    const addCarsField = (col, val) => {
      if (val === undefined) return;
      setCars.push(`${col}=?`);
      paramsCars.push(val);
    };

    addCarsField("name", name);
    addCarsField("brand", brand);
    addCarsField("category_id", category_id);
    addCarsField("car_details", car_details);
    addCarsField("city", city);
    addCarsField("year", year);
    addCarsField("seats", seats);
    addCarsField("fuel_type", fuel_type);
    addCarsField("price_per_day", price_per_day);
    addCarsField("price_per_km", price_per_km);
    addCarsField("vehicle_type", vehicle_type);
    if (newCarsImage) addCarsField("cars_image", newCarsImage);

    // update cars only if exists (APPROVED creates record)
    if (setCars.length > 0) {
      await exe(
        `UPDATE cars SET ${setCars.join(", ")} WHERE car_request_id=? AND car_user_id=?`,
        [...paramsCars, id, carUserId]
      );
    }

    // ✅ remove old files if replaced (optional)
    if (newCarsImage && oldReq.cars_image && oldReq.cars_image !== newCarsImage) unlinkIfExists(oldReq.cars_image);
    if (newRcBook && oldReq.rc_book && oldReq.rc_book !== newRcBook) unlinkIfExists(oldReq.rc_book);
    if (newInsurance && oldReq.insurance_copy && oldReq.insurance_copy !== newInsurance) unlinkIfExists(oldReq.insurance_copy);
    if (newPuc && oldReq.puc_certificate && oldReq.puc_certificate !== newPuc) unlinkIfExists(oldReq.puc_certificate);
    if (newIdProof && oldReq.id_proof && oldReq.id_proof !== newIdProof) unlinkIfExists(oldReq.id_proof);

    return res.json({ message: "Car updated successfully ✅" });
  } catch (err) {
    console.error("updateCarBothTables error:", err);
    return res.status(500).json({ message: "Failed to update car" });
  }
};

// ✅ DELETE /car-register/cars/:id
exports.deleteCarBothTables = async (req, res) => {
  try {
    const id = Number(req.params.id); // car_registration_requests.id
    const carUserId = req.user?.id;

    if (!carUserId) return res.status(401).json({ message: "Unauthorized" });
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid id" });

    // ✅ 1) get request row first (for file cleanup)
    const reqRows = await exe(
      `SELECT * FROM car_registration_requests WHERE id=? AND car_user_id=? LIMIT 1`,
      [id, carUserId]
    );

    if (!reqRows || reqRows.length === 0) {
      return res.status(404).json({ message: "Car request not found" });
    }

    const oldReq = reqRows[0];

    // ✅ 2) find car id in cars table (if approved car exists)
    const carRows = await exe(
      `SELECT id FROM cars WHERE car_request_id=? AND car_user_id=? LIMIT 1`,
      [id, carUserId]
    );

    const carId = carRows?.[0]?.id;

    // ✅ 3) If car exists in cars table, check bookings
    if (carId) {
      // Option A: block delete if ANY booking exists and not cancelled
      const bkRows = await exe(
        `SELECT COUNT(*) AS cnt
         FROM bookings
         WHERE car_id=? 
           AND status NOT IN ('CANCELLED')`,
        [carId]
      );

      const cnt = Number(bkRows?.[0]?.cnt || 0);

      if (cnt > 0) {
        return res.status(400).json({
          message: "Cannot delete. This car is already booked.",
        });
      }

      // Option B (stricter): only future/active bookings
      // const bkRows = await exe(
      //   `SELECT COUNT(*) AS cnt
      //    FROM bookings
      //    WHERE car_id=?
      //      AND start_date >= CURDATE()
      //      AND status NOT IN ('CANCELLED')`,
      //   [carId]
      // );
    }

    // ✅ 4) delete from cars table first (if exists)
    await exe(`DELETE FROM cars WHERE car_request_id=? AND car_user_id=?`, [id, carUserId]);

    // ✅ 5) delete from request table
    await exe(`DELETE FROM car_registration_requests WHERE id=? AND car_user_id=?`, [id, carUserId]);

    // ✅ 6) cleanup uploaded files (optional)
    unlinkIfExists(oldReq.cars_image);
    unlinkIfExists(oldReq.rc_book);
    unlinkIfExists(oldReq.insurance_copy);
    unlinkIfExists(oldReq.puc_certificate);
    unlinkIfExists(oldReq.id_proof);

    return res.json({ message: "Car deleted successfully ✅" });
  } catch (err) {
    console.error("deleteCarBothTables error:", err);
    return res.status(500).json({ message: "Failed to delete car" });
  }
};
