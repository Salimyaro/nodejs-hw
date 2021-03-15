import express from "express";
const { Router } = express;
import validate from "./validation.js";
import guard from "../../../helpers/guard.js";
import upload from "../../../helpers/upload.js";
import userController from "../../../controllers/users.js";
import { createAccountLimiter } from "../../../helpers/rate-limit-reg.js";
const router = Router();

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
export default router;
