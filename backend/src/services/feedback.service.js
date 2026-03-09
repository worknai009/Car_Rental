// backend/src/services/feedback.service.js
const db = require("../config/db");

exports.getCarReviews = async (car_id) => {
  const sql = `
    SELECT
      f.id, f.user_id, f.booking_id, f.car_id,
      f.message, f.rating, f.created_at,
      u.name AS username,
      c.name AS car_name,
      c.brand AS car_brand
    FROM feedback f
    LEFT JOIN users u ON u.id = f.user_id
    LEFT JOIN cars c ON c.id = f.car_id
    WHERE f.car_id = ?
    ORDER BY f.created_at DESC
  `;
  return db.exe(sql, [car_id]);
};

exports.getLatestFeedback = async (limit = 6) => {
  const safeLimit = Math.max(1, Math.min(12, Number(limit) || 6)); // clamp 1..12

  const sql = `
    SELECT
      f.id, f.user_id, f.booking_id, f.car_id,
      f.message, f.rating, f.created_at,
      u.name AS username,
      c.name AS car_name,
      c.brand AS car_brand
    FROM feedback f
    LEFT JOIN users u ON u.id = f.user_id
    LEFT JOIN cars c ON c.id = f.car_id
    ORDER BY f.created_at DESC
    LIMIT ${safeLimit}
  `;
  return db.exe(sql);
};

exports.createFeedback = async ({ user_id, booking_id, rating, message }) => {
  const bookingSql = `
    SELECT id, car_id
    FROM bookings
    WHERE id = ? AND user_id = ?
    LIMIT 1
  `;
  const bookingRows = await db.exe(bookingSql, [booking_id, user_id]);
  const booking = Array.isArray(bookingRows) ? bookingRows[0] : null;

  if (!booking) throw new Error("Invalid booking_id (not found or not yours)");

  const insertSql = `
    INSERT INTO feedback (user_id, booking_id, car_id, message, rating, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const result = await db.exe(insertSql, [
    user_id,
    booking_id,
    booking.car_id,
    message,
    rating,
  ]);

  return { id: result?.insertId || null, car_id: booking.car_id };
};
