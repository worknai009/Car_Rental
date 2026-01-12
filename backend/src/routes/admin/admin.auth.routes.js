const router = require("express").Router();
const adminAuthController = require("../../controllers/admin/admin.auth.controller");

router.post("/register", adminAuthController.register); // optional
router.post("/login", adminAuthController.login);

module.exports = router;