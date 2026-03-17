const router = require("express").Router();
const categoryCtrl = require("../../controllers/admin/admin.category.controller");

router.post("/", categoryCtrl.addCategory);
router.get("/", categoryCtrl.getCategories);
router.put("/:id", categoryCtrl.updateCategory);
router.delete("/:id", categoryCtrl.deleteCategory);

module.exports = router;
