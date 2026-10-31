import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser, resetPassword, sendForgotPasswordOtp, sendOtp, verifyEmail, verifyForgotPasswordOtp, verifyOtp } from "./auth.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post(
  "/verify-email",
  verifyEmail
);
router.post(
  "/login",
  loginUser
);
router.post(
  "/send-otp",
  sendOtp
);
router.post(
  "/verify-otp",
  verifyOtp
);
router.post(
  "/forgot-password/send-otp",
  sendForgotPasswordOtp
);

router.post(
  "/forgot-password/verify-otp",
  verifyForgotPasswordOtp
);

router.post(
  "/forgot-password/reset-password",
  resetPassword
);
router.post("/logout", logoutUser);
router.get(
  "/me",
  authenticate,
  getCurrentUser
);

export default router;