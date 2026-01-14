const router = require("express").Router();
const bookingCtrl = require("../../controllers/admin/admin.booking.controller");
const jwtUtils = require("../../utils/jwt");

// bookings list
router.get("/", jwtUtils.authMiddleware("admin"), bookingCtrl.getAllBookings);

// booking details
router.get("/:id", jwtUtils.authMiddleware("admin"), bookingCtrl.getBookingById);

// ✅ status update (recommended PATCH)
router.patch("/:id/status", jwtUtils.authMiddleware("admin"), bookingCtrl.updateBookingStatus);

module.exports = router;
