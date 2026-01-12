// src/controllers/admin/admin.feedback.controller.js
const { exe } = require("../../config/db");

// Get all feedbacks (admin view)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await exe(`
      SELECT f.id, f.message, f.rating, f.created_at,
             u.name AS user_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      ORDER BY f.id DESC
    `);
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

// Delete feedback by ID
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await exe("DELETE FROM feedback WHERE id=?", [id]);
    if (!result.affectedRows)
      return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
};
