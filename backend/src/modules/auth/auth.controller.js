import asyncHandler from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
    },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  await authService.verifyEmail(token);

  res.status(200).json({
    success: true,
    message:
      "Email verified successfully. You can now login to your account.",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(
    req.body
  );

  res.status(200).json({
    success: true,
    message:
      "OTP sent to your email. Please check your inbox.",
    data: result,
  });
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.sendOtp(email);

  res.status(200).json({
    success: true,
    message:
      "OTP sent to your email. Please check your inbox.",
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { token, user } =
    await authService.verifyOtp(req.body);

  res.cookie("Token_Access", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successfully.",
    data: {
      user,
    },
  });
});

export const sendForgotPasswordOtp = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    await authService.sendForgotPasswordOtp(email);

    res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please check your inbox.",
    });
  }
);
export const verifyForgotPasswordOtp = asyncHandler(
  async (req, res) => {
    const result =
      await authService.verifyForgotPasswordOtp(
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "OTP verified. You can now set your new password.",
      data: result,
    });
  }
);
export const resetPassword = asyncHandler(
  async (req, res) => {
    await authService.resetPassword(
      req.body
    );

    res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  }
);
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("Token_Access", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});