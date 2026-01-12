const router = require("express").Router();
const contactCtrl = require("../../controllers/admin/admin.contact.controller");
const jwtUtils = require("../../utils/jwt");

// Admin protected
router.get("/", jwtUtils.authMiddleware("admin"), contactCtrl.getAllContacts);
router.delete("/:id", jwtUtils.authMiddleware("admin"), contactCtrl.deleteContact);

module.exports = router;
