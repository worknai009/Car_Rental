const router = require("express").Router();
const feedbackCtrl = require("../../controllers/admin/admin.feedback.controller");
const jwtUtils = require("../../utils/jwt");

// Protect routes with admin auth
router.use(jwtUtils.authMiddleware("admin"));

// Get all feedbacks
router.get("/", feedbackCtrl.getAllFeedbacks);

// Delete a feedback
router.delete("/:id", feedbackCtrl.deleteFeedback);

module.exports = router;
