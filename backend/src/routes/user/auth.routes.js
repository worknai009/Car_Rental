const router = require("express").Router();
const authController = require("../../controllers/user/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
module.exports = router;
