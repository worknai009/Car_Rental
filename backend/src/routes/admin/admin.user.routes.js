const router = require("express").Router();
const ctrl = require("../../controllers/admin/admin.user.controller");
const jwtUtils = require("../../utils/jwt");

router.get("/", jwtUtils.authMiddleware("admin"), ctrl.getUsers);
router.delete("/:id", jwtUtils.authMiddleware("admin"), ctrl.deleteUser);

module.exports = router;
