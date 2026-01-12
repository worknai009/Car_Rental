const router = require("express").Router();
const jwtUtils = require("../../utils/jwt");
const chartCtrl = require("../../controllers/admin/admin.chart.controller");

router.get("/pie", jwtUtils.authMiddleware("admin"), chartCtrl.pieCategoryCars);
router.get("/bar", jwtUtils.authMiddleware("admin"), chartCtrl.barRevenueByCategory);

module.exports = router;
