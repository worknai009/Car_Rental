const router = require("express").Router();
const ctrl = require("../../controllers/admin/admin.dashboard.controller");
const jwtUtils = require("../../utils/jwt");

router.get("/", jwtUtils.authMiddleware("admin"), ctrl.dashboard);
router.get("/revenue", jwtUtils.authMiddleware("admin"), ctrl.revenueReport);
router.get("/bar", jwtUtils.authMiddleware("admin"), ctrl.barChart);
router.get("/pie", jwtUtils.authMiddleware("admin"), ctrl.pieChart);


module.exports = router;
