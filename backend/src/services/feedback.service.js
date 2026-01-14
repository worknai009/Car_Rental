const { exe } = require("../config/db");

async function getCarReviews(car_id) {
  const rows = await exe(
    `SELECT f.id, f.message, f.rating, f.created_at,
            u.name AS user_name
     FROM feedback f
     LEFT JOIN users u ON u.id = f.user_id
     WHERE f.car_id = ?
     ORDER BY f.id DESC`,
    [car_id]
  );
  return rows;
}

async function createFeedback({ user_id, booking_id, message, rating }) {
  // ✅ derive car_id from booking_id (do not trust frontend)
  const bk = await exe(
    `SELECT id, car_id, user_id, status
     FROM bookings
     WHERE id=? AND user_id=?
     LIMIT 1`,
    [booking_id, user_id]
  );

  if (!bk.length) throw new Error("Invalid booking id");

  // OPTIONAL: only allow feedback after completed
  // if (String(bk[0].status || "").toUpperCase() !== "COMPLETED") {
  //   throw new Error("Ride not completed yet");
  // }

  const car_id = bk[0].car_id;

  const result = await exe(
    `INSERT INTO feedback (user_id, booking_id, car_id, message, rating, created_at)
     VALUES (?,?,?,?,?, NOW())`,
    [user_id, booking_id, car_id, message, rating]
  );

  return { id: result.insertId, car_id, booking_id };
}

module.exports = {
  getCarReviews,
  createFeedback,
};
