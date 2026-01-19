const express = require("express");
const router = express.Router();
const auth = require("../../middleware/carRegisterAuth.middleware");
const ctrl = require("../../controllers/car-register/carRegister.controller");

/* ===== FILE UPLOAD ===== */


router.get("/categories", auth, ctrl.getCategories);
router.post("/cars/add", auth, ctrl.addCarRequest); 
router.get("/cars/my", auth, ctrl.getMyCars);
router.get("/cars/my/all", auth, ctrl.getMyCarsAll);
router.get("/dashboard/stats", auth, ctrl.getDashboardStats);
router.get("/bookings/my", auth, ctrl.getMyBookings);


module.exports = router;
