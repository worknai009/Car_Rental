// combine all routes


const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/users", require("./user.routes"));
router.use("/cars", require("./car.routes"));
router.use("/bookings", require("./booking.routes"));
router.use("/feedback", require("./feedback.routes"));
router.use("/contact", require("./contact.routes"));
// in routes/user/booking.routes.js (or wherever /bookings routes are mounted)
router.use("/bookings", require("./cancelRequest.routes"));


module.exports = router;
