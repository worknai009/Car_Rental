const { exe } = require("../../config/db");

exports.getAllFeedbacks = async (req, res) => {
  try {
    const rows = await exe(
      `SELECT id, user_id, booking_id, car_id, message, rating, created_at
       FROM feedback
       ORDER BY created_at DESC`
    );
    return res.json({ feedbacks: rows });
  } catch (err) {
    console.error("getAllFeedbacks error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await exe("DELETE FROM feedback WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    return res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("deleteFeedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
