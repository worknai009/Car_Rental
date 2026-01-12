const router = require("express").Router();
const userCtrl = require("../../controllers/user/user.controller");
const auth = require("../../middleware/auth.middleware");

router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getProfile);
router.put("/:id", auth, userCtrl.updateProfile);

module.exports = router;
