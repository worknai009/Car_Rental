const router = require("express").Router();
const auth = require("../../middleware/carRegisterAuth.middleware");
const ctrl = require("../../controllers/car-register/carRegister.booking.controller");

// ✅ All bookings of MY cars (owner view)
router.get("/my", auth, ctrl.getMyCarBookings);

// ✅ Update booking status (only if booking belongs to owner)
router.patch("/:id/status", auth, ctrl.updateMyCarBookingStatus);

module.exports = router;
