const express = require("express");
const router = express.Router();

const jwtUtils = require("../../utils/jwt");
const validate = require("../../middleware/validate");
const { updateEventRequestStatusValidation } = require("../../validations/eventRequest.validation");
const adminEventRequestController = require("../../controllers/admin/eventRequest.controller");

// ✅ list all requests
router.get(
  "/",
  jwtUtils.authMiddleware("admin"),
  adminEventRequestController.listRequests
);

// ✅ single request detail
router.get(
  "/:id",
  jwtUtils.authMiddleware("admin"),
  adminEventRequestController.getRequestById
);

// ✅ update status
router.patch(
  "/:id/status",
  jwtUtils.authMiddleware("admin"),
  updateEventRequestStatusValidation,
  validate,
  adminEventRequestController.updateStatus
);

module.exports = router;
