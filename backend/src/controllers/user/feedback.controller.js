const { exe } = require("../../config/db");

exports.addFeedback = async (req, res) => {
  const { booking_id, message, rating } = req.body;

  await exe(
    `INSERT INTO feedback 
     (user_id,booking_id,message,rating,created_at)
     VALUES (?,?,?,?,NOW())`,
    [req.user.id, booking_id, message, rating]
  );

  res.json({ message: "Feedback submitted" });
};

exports.getMyFeedbacks = async (req, res) => {
  const data = await exe(
    `
    SELECT f.*, c.name AS car_name
    FROM feedback f
    JOIN bookings b ON f.booking_id=b.id
    JOIN cars c ON b.car_id=c.id
    WHERE f.user_id=?
    `,
    [req.user.id]
  );

  res.json(data);
};
