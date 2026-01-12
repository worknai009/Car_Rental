
const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin/admin.controller");
const jwtUtils = require("../../utils/jwt");

router.use("/auth", require("./admin.auth.routes"));
router.use("/users", require("./admin.user.routes"));
router.use("/categories", require("./admin.category.routes"));
router.use("/cars", require("./admin.car.routes"));
router.use("/bookings", require("./admin.booking.routes"));
router.use("/feedbacks", require("./admin.feedback.routes"));
router.use("/contacts", require("./admin.contact.routes"));
router.use("/charts", require("./admin.chart.routes"));
router.use("/dashboard", require("./admin.dashboard.routes")); // ✅ NEW
router.use("/cancel-requests", require("./cancelRequest.admin.routes"));

module.exports = router;
