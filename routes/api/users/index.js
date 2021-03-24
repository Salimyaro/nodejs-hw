const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const validate = require("./validation");
const { createAccountLimiter } = require("../../../helpers/rate-limit-reg");

router.post(
  "/auth/register",
  createAccountLimiter,
  validate.user,
  userController.reg
);
router.post("/auth/login", validate.user, userController.login);
router.post("/auth/logout", guard, userController.logout);
router.get("/current", guard, userController.current);
router.patch(
  "/",
  [guard, validate.subscriptionUpdate],
  userController.updateSubscription
);
router.patch(
  "/avatars",
  [guard, upload.single("avatar"), validate.uploadAvatar],
  userController.avatars
);
router.get("/auth/verify/:verificationToken", userController.verifyToken);
module.exports = router;
