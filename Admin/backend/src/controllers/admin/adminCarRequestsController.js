const util = require("util");
const db = require("../../config/db"); // { conn, exe }



const ALLOWED_STATUS = ["PENDING", "APPROVED", "REJECTED"];

const badgeFromLuxury = (luxId) => {
  if (String(luxId) === "1") return "SILVER";
  if (String(luxId) === "2") return "GOLD";
  if (String(luxId) === "3") return "PLATINUM";
  return null;
};

// GET /admin/car-requests?status=PENDING
exports.listCarRequests = async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT
        crr.id,
        crr.car_user_id,

        cru.name AS car_register_user,
        crr.name AS car_name,
        crr.brand,
        crr.city,
        crr.fuel_type,
        crr.seats,
        crr.price_per_day,
        crr.vehicle_type,
        crr.status,

        crr.cars_image AS cars_image,

        crr.rc_book,
        crr.insurance_copy,
        crr.puc_certificate,
        crr.id_proof,

        crr.car_details,
        crr.category_id,
        crr.requested_category_id,
        crr.approved_category_id,
        crr.price_per_km,
        crr.year,
        crr.admin_remark,
        crr.created_at,
        crr.updated_at

      FROM car_registration_requests crr
      LEFT JOIN car_register_users cru ON cru.id = crr.car_user_id
    `;

    const params = [];

    if (status && ALLOWED_STATUS.includes(status)) {
      sql += ` WHERE crr.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY crr.created_at DESC`;

    const rows = await db.exe(sql, params);
    return res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load car requests" });
  }
};


// GET /admin/car-requests/:id
exports.getCarRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await db.exe(
      `SELECT * FROM car_registration_requests WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load request" });
  }
};

// POST /admin/car-requests/:id/approve
// body: { approved_category_id?, admin_remark? }
// POST /admin/car-requests/:id/approve
// exports.approveCarRequest = async (req, res) => {
//   const { id } = req.params;
//   const { approved_category_id, admin_remark } = req.body;

//   try {
//     const rows = await db.exe(
//       `SELECT * FROM car_registration_requests WHERE id = ? LIMIT 1`,
//       [id]
//     );

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     const r = rows[0];

//     // ✅ if rejected, don’t allow publish
//     if (r.status === "REJECTED") {
//       return res.status(400).json({ message: "REJECTED request cannot be approved" });
//     }

//     const finalApprovedCategoryId =
//       approved_category_id || r.approved_category_id || r.requested_category_id;

//     // ✅ update status only if still pending
//     if (r.status === "PENDING") {
//       await db.exe(
//         `UPDATE car_registration_requests
//          SET status='APPROVED',
//              approved_category_id=?,
//              admin_remark=?,
//              updated_at=NOW()
//          WHERE id=?`,
//         [finalApprovedCategoryId, admin_remark || null, id]
//       );
//     }

//     // ✅ badge
//     let badge = null;
//     if (String(finalApprovedCategoryId) === "1") badge = "SILVER";
//     if (String(finalApprovedCategoryId) === "2") badge = "GOLD";
//     if (String(finalApprovedCategoryId) === "3") badge = "PLATINUM";

//     // ✅ prevent duplicate car publish
//     const exists = await db.exe(
//       `SELECT id FROM cars WHERE name=? AND brand=? AND cars_image=? LIMIT 1`,
//       [r.name, r.brand, r.cars_image]
//     );

//     if (!exists || exists.length === 0) {
//       await db.exe(
//         `INSERT INTO cars
//           (name, brand, car_details, cars_image, category_id, price_per_day,
//            is_available, city, year, seats, fuel_type, rating, badge, is_active, created_at)
//          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
//         [
//           r.name,
//           r.brand,
//           r.car_details,
//           r.cars_image,
//           r.category_id,
//           r.price_per_day,
//           1,
//           r.city,
//           r.year,
//           r.seats,
//           r.fuel_type,
//           0,
//           badge,
//           1,
//         ]
//       );
//     }

//     return res.json({ message: "Car approved & published ✅" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Approve failed" });
//   }
// };

exports.approveCarRequest = async (req, res) => {
  const { id } = req.params;
  const { approved_category_id, admin_remark } = req.body;

  try {
    const rows = await db.exe(
      `SELECT * FROM car_registration_requests WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const r = rows[0];

    // ✅ if rejected, don’t allow publish
    if (r.status === "REJECTED") {
      return res
        .status(400)
        .json({ message: "REJECTED request cannot be approved" });
    }

    const finalApprovedCategoryId =
      approved_category_id || r.approved_category_id || r.requested_category_id;

    // ✅ update request status only if still pending
    if (r.status === "PENDING") {
      await db.exe(
        `UPDATE car_registration_requests
         SET status='APPROVED',
             approved_category_id=?,
             admin_remark=?,
             updated_at=NOW()
         WHERE id=?`,
        [finalApprovedCategoryId, admin_remark || null, id]
      );
    }

    // ✅ badge
    let badge = null;
    if (String(finalApprovedCategoryId) === "1") badge = "SILVER";
    if (String(finalApprovedCategoryId) === "2") badge = "GOLD";
    if (String(finalApprovedCategoryId) === "3") badge = "PLATINUM";

    // ✅ prevent duplicate publish (BEST: by car_request_id)
    const exists = await db.exe(
      `SELECT id FROM cars WHERE car_request_id=? LIMIT 1`,
      [r.id]
    );

    if (!exists || exists.length === 0) {
      await db.exe(
        `INSERT INTO cars
          (car_user_id, car_request_id,
           name, brand, car_details, cars_image, category_id, vehicle_type, price_per_day, price_per_km,
           is_available, city, year, seats, fuel_type, rating, badge, is_active, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
        [
          r.car_user_id, // ✅ car-register user id
          r.id,          // ✅ request id

          r.name,
          r.brand,
          r.car_details,
          r.cars_image,
          r.category_id,
          r.vehicle_type,
          r.price_per_day,
          r.price_per_km,
          1,
          r.city,
          r.year,
          r.seats,
          r.fuel_type,
          0,
          badge,
          1,
        ]
      );
    }

    return res.json({ message: "Car approved & published ✅" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Approve failed" });
  }
};

// POST /admin/car-requests/:id/reject
// body: { reason } (or admin_remark)
exports.rejectCarRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const reason = req.body?.reason || req.body?.admin_remark;

    if (!reason) {
      return res.status(400).json({ message: "Reject reason is required" });
    }

    const rows = await db.exe(
      `SELECT id, status FROM car_registration_requests WHERE id=? LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (rows[0].status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Only PENDING requests can be rejected" });
    }

    await db.exe(
      `UPDATE car_registration_requests
       SET status='REJECTED',
           admin_remark=?,
           updated_at=NOW()
       WHERE id=?`,
      [reason, id]
    );

    return res.json({ message: "Car request rejected successfully ✅" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Reject failed" });
  }
};

