const { exe } = require("../../config/db");


// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await exe(`
//       SELECT 
//         b.id,
//         b.start_date AS start_date,
//         b.end_date AS end_date,
//         CAST(b.total_amount AS DECIMAL(10,2)) AS total_amount,
//         COALESCE(b.status,'Booked') AS status,
//         b.created_at,
//         b.pickup_location,
//         b.drop_location,
//         u.name AS user_name,
//         u.email AS user_email,
//         u.phone AS user_phone, 
//         c.name AS car_name
//       FROM bookings b
//       JOIN users u ON b.user_id=u.id
//       JOIN cars c ON b.car_id=c.id
//       ORDER BY b.id DESC
//     `);

//     res.json(bookings);
//   } catch (err) {
//     console.error("BOOKINGS ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };



exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await exe(`
      SELECT 
        b.id,
        b.start_date AS start_date,
        b.end_date AS end_date,
        CAST(b.total_amount AS DECIMAL(10,2)) AS total_amount,
        COALESCE(b.status,'Booked') AS status,
        b.created_at,
        b.pickup_location,
        b.drop_location,

        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,

        c.name AS car_name,
        c.brand AS car_brand,

        -- ✅ car owner / register user
        cru.name  AS car_owner_name,
        cru.email AS car_owner_email,
        cru.phone AS car_owner_phone

      FROM bookings b
      JOIN users u ON b.user_id=u.id
      JOIN cars c ON b.car_id=c.id
      LEFT JOIN car_register_users cru ON cru.id = c.car_user_id

      ORDER BY b.id DESC
    `);

    res.json(bookings);
  } catch (err) {
    console.error("BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};



// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const rows = await exe(
//       `
//       SELECT
//         b.id AS booking_id,
//         b.pickup_location,
//         b.drop_location,
//         b.start_date,
//         b.end_date,
//         b.total_amount,
//         b.status,
//         b.created_at,

//         u.id AS user_id,
//         u.name AS user_name,
//         u.email AS user_email,
//         u.phone AS user_phone, 

//         c.id AS car_id,
//         c.name AS car_name,
//         c.brand AS car_brand,
//         c.cars_image AS car_image,
//         c.price_per_day
//       FROM bookings b
//       JOIN users u ON b.user_id = u.id
//       JOIN cars c ON b.car_id = c.id
//       WHERE b.id = ?
//       `,
//       [id]
//     );

//     if (!rows.length) return res.status(404).json({ message: "Booking not found" });

//     res.json(rows[0]);
//   } catch (err) {
//     console.error("BOOKING DETAILS ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch booking details" });
//   }
// };


exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await exe(
      `
      SELECT
        b.id AS booking_id,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.status,
        b.created_at,

        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,

        c.id AS car_id,
        c.name AS car_name,
        c.brand AS car_brand,
        c.cars_image AS car_image,
        c.price_per_day,

        -- ✅ car owner / register user
        cru.id    AS car_owner_id,
        cru.name  AS car_owner_name,
        cru.email AS car_owner_email,
        cru.phone AS car_owner_phone

      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      LEFT JOIN car_register_users cru ON cru.id = c.car_user_id
      WHERE b.id = ?
      `,
      [id]
    );

    if (!rows.length) return res.status(404).json({ message: "Booking not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("BOOKING DETAILS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
};


const ALLOWED_STATUS = [
  "BOOKED",
  "APPROVED",
  "CONFIRMED", 
  "PAID",
  "COMPLETED",
  "CANCELLED",
  "CANCEL_REQUESTED",
];

exports.updateBookingStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid booking id" });

    let { status } = req.body;
    status = String(status || "").trim().toUpperCase();

    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}`,
      });
    }

    const result = await exe("UPDATE bookings SET status=? WHERE id=?", [status, id]);

    // mysql2 can return either object or [object]
    const info = Array.isArray(result) ? result[0] : result;
    const affected = info?.affectedRows ?? info?.[0]?.affectedRows ?? 0;

    if (!affected) return res.status(404).json({ message: "Booking not found" });

    return res.json({ message: "Booking status updated", id, status });
  } catch (err) {
    console.error("BOOKING STATUS ERROR:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Booking id is required" });

    // ✅ first check booking exists (parameterized query)
    const found = await exe(`SELECT id FROM bookings WHERE id=? LIMIT 1`, [id]);
    if (!found || found.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ delete related cancel_requests first (FK cleanup)
    await exe(`DELETE FROM cancel_requests WHERE booking_id=?`, [id]);

    // ✅ delete booking (parameterized query)
    await exe(`DELETE FROM bookings WHERE id=?`, [id]);

    return res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("DELETE BOOKING ERROR:", err);
    return res.status(500).json({ message: "Failed to delete booking" });
  }
};
