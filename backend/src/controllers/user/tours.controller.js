const { exe } = require("../../config/db");

// GET Active Tours
exports.getPublicTours = async (req, res) => {
  try {
    const rows = await exe("SELECT * FROM tours_packages WHERE is_active=1 AND status='APPROVED' ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tours" });
  }
};

// GET Tour Details
exports.getTourDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await exe("SELECT * FROM tours_packages WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Tour not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tour details" });
  }
};

// POST Book Tour
exports.bookTour = async (req, res) => {
  try {
    const { tour_id, booking_date, start_date, num_persons, total_amount } = req.body;
    const user_id = req.user.id;

    await exe(
      `INSERT INTO tour_bookings (user_id, tour_id, booking_date, start_date, num_persons, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [user_id, tour_id, booking_date, start_date, num_persons, total_amount]
    );

    res.json({ message: "Tour booked successfully! Pending approval. ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book tour" });
  }
};

// GET My Tour Bookings
exports.getMyTourBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const rows = await exe(`
      SELECT b.*, t.title as tour_title, t.images as tour_images, t.duration as tour_duration
      FROM tour_bookings b
      JOIN tours_packages t ON b.tour_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [user_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
};
