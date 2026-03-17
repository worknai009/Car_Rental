const router = require("express").Router();
const adminAuthController = require("../../controllers/admin/admin.auth.controller");
const jwtUtils = require("../../utils/jwt");

// ✅ Protected: only existing admins can register new admins
router.post("/register", jwtUtils.authMiddleware("admin"), adminAuthController.register);
router.post("/login", adminAuthController.login);
router.get("/logout", adminAuthController.logout);

module.exports = router;