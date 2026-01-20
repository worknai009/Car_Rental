const express = require("express");
const router = express.Router();
const jwtUtils = require("../../utils/jwt");

const ctrl = require("../../controllers/admin/adminCarRegisterUsersController");

// ✅ protect all routes (admin only)
router.use(jwtUtils.authMiddleware("admin"));

// GET  /admin/car-register-users?status=ACTIVE&q=ruturaj
router.get("/", ctrl.listCarRegisterUsers);

// GET  /admin/car-register-users/:id
router.get("/:id", ctrl.getCarRegisterUserById);

// PATCH /admin/car-register-users/:id/status  body: { status: "ACTIVE" }
router.patch("/:id/status", ctrl.updateCarRegisterUserStatus);

module.exports = router;
