const express = require("express");
const router = express.Router();
const jwtUtils = require("../../utils/jwt");

const {
  listCarRequests,
  getCarRequestById,
  approveCarRequest,
  rejectCarRequest,
} = require("../../controllers/admin/adminCarRequestsController");

// ✅ protect all routes
router.use(jwtUtils.authMiddleware("admin"));

router.get("/", listCarRequests);
router.get("/:id", getCarRequestById);
router.post("/:id/approve", approveCarRequest);
router.post("/:id/reject", rejectCarRequest);

module.exports = router;
