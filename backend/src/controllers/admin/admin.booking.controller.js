const { exe } = require("../../config/db");


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
        c.name AS car_name
      FROM bookings b
      JOIN users u ON b.user_id=u.id
      JOIN cars c ON b.car_id=c.id
      ORDER BY b.id DESC
    `);

    res.json(bookings);
  } catch (err) {
    console.error("BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};



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

        c.id AS car_id,
        c.name AS car_name,
        c.brand AS car_brand,
        c.cars_image AS car_image,
        c.price_per_day
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
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

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await exe("UPDATE bookings SET status=? WHERE id=?", [status, id]);
    res.json({ message: "Booking status updated" });
  } catch (err) {
    console.error("BOOKING STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
