const express = require("express");
const router = express.Router();
const adminToursController = require("../../controllers/admin/admin.tours.controller");
const { authMiddleware } = require("../../utils/jwt");

// All routes here are protected by admin auth
router.use(authMiddleware("admin"));

// Tour Packages
router.get("/packages", adminToursController.getAllTours);
router.get("/packages/:id", adminToursController.getTourDetails);
router.post("/packages", adminToursController.addTour);
router.put("/packages/:id", adminToursController.updateTour);
router.delete("/packages/:id", adminToursController.deleteTour);

// Tour Bookings
router.get("/bookings", adminToursController.getAllTourBookings);
router.patch("/bookings/:id/status", adminToursController.updateBookingStatus);

module.exports = router;
