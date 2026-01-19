const { exe } = require("../../config/db");

// Car-owner allowed updates (recommended)
const OWNER_ALLOWED_STATUS = ["CONFIRMED", "COMPLETED", "CANCEL_REQUESTED"];

exports.getMyCarBookings = async (req, res) => {
  try {
    // ✅ show bookings for cars owned by logged in car-register user
    const rows = await exe(
      `
      SELECT
        b.id AS booking_id,
        b.status,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.created_at,
        b.booking_mode,
        b.start_time,

        c.id AS car_id,
        c.name AS car_name,
        c.brand AS car_brand,
        c.cars_image,
        c.car_user_id
      FROM bookings b
      JOIN cars c ON c.id = b.car_id
      WHERE c.car_user_id = ?
      ORDER BY b.id DESC
      `,
      [req.user.id]
    );

    return res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error("getMyCarBookings error:", err);
    return res.status(500).json({ message: "Failed to load bookings" });
  }
};

// ✅ PATCH /car-register/bookings/:id/status
exports.updateMyCarBookingStatus = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!bookingId) return res.status(400).json({ message: "Invalid booking id" });

    let { status } = req.body;
    status = String(status || "").trim().toUpperCase();

    if (!status) return res.status(400).json({ message: "Status is required" });

    // ✅ Only allow safe statuses for car-owner
    if (!OWNER_ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${OWNER_ALLOWED_STATUS.join(", ")}`,
      });
    }

    // ✅ Check booking belongs to this car-owner
    const rows = await exe(
      `
      SELECT b.id, b.status, c.car_user_id
      FROM bookings b
      JOIN cars c ON c.id = b.car_id
      WHERE b.id = ? AND c.car_user_id = ?
      LIMIT 1
      `,
      [bookingId, req.user.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(403).json({ message: "Not allowed (not your car booking)" });
    }

    // ✅ Update booking status
    const result = await exe(`UPDATE bookings SET status=? WHERE id=?`, [status, bookingId]);
    const info = Array.isArray(result) ? result[0] : result;
    const affected = info?.affectedRows ?? 0;

    if (!affected) return res.status(404).json({ message: "Booking not found" });

    return res.json({ message: "Booking status updated ✅", booking_id: bookingId, status });
  } catch (err) {
    console.error("updateMyCarBookingStatus error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};
