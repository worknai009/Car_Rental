const { exe } = require("../../config/db");

exports.dashboard = async (req, res) => {
  try {
    const revenue = await exe("SELECT SUM(total_amount) AS total FROM bookings");
    const bookings = await exe("SELECT COUNT(*) AS total FROM bookings");
    const users = await exe("SELECT COUNT(*) AS total FROM users");
    const cars = await exe("SELECT COUNT(*) AS total FROM cars");

    res.json({
      totalRevenue: revenue[0].total || 0,
      bookingCount: bookings[0].total || 0,
      userCount: users[0].total || 0,
      carCount: cars[0].total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};
