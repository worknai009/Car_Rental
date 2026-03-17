const router = require("express").Router();
const jwtUtils = require("../../utils/jwt");
const ctrl = require("../../controllers/admin/cancelRequest.admin.controller");

// Because this router is already mounted at /admin/cancel-requests
router.get("/", jwtUtils.authMiddleware("admin"), ctrl.listCancelRequests);
router.put("/:id/approve", jwtUtils.authMiddleware("admin"), ctrl.approveCancelRequest);
router.put("/:id/reject", jwtUtils.authMiddleware("admin"), ctrl.rejectCancelRequest);



module.exports = router;
