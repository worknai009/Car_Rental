const router = require("express").Router();
const feedbackCtrl = require("../../controllers/user/feedback.controller");
const jwtUtils = require("../../utils/jwt");

router.post(
  "/feedback",
  jwtUtils.authMiddleware("user"),
  feedbackCtrl.addFeedback
);

router.get(
  "/feedbacks",
  jwtUtils.authMiddleware("user"),
  feedbackCtrl.getMyFeedbacks
);


module.exports = router;
