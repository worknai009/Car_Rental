const router = require("express").Router();
const bookingCtrl = require("../../controllers/admin/admin.booking.controller");
const jwtUtils = require("../../utils/jwt");

router.get("/", jwtUtils.authMiddleware("admin"), bookingCtrl.getAllBookings);
router.get("/:id", jwtUtils.authMiddleware("admin"), bookingCtrl.getBookingById);
router.put("/:id", jwtUtils.authMiddleware("admin"), bookingCtrl.updateBookingStatus);

module.exports = router;
