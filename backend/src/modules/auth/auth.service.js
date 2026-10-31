import bcrypt from "bcryptjs";
import prisma from "../../config/database.js";
import ApiError from "../../utils/ApiError.js";
import { zSchema } from "./auth.validation.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../../services/mail.service.js";
import { emailVerificationTemplate } from "../../emails/emailVerification.js";
import { otpEmailTemplate } from "../../emails/otpEmail.js";
import generateOtp from "../../utils/generateOtp.js";
import z from "zod";

export const registerUser = async (data) => {
  const payload = data;

 

   const ValidateSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    })

    const validatedData = ValidateSchema.safeParse(payload);

  if (!validatedData.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const { name, email, password } = validatedData.data;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name?.trim(),
      email: normalizedEmail,
      passwordHash,
    },

    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      status: true,
      plan: true,
      createdAt: true,
    },
  });

   // Create email verification token
  const verificationToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Frontend verification URL
  const verificationUrl =
    `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;

  // Send verification email
  const mailResponse = await sendMail(
    user.email,
    "Verify your Bullish Pixel account",
    emailVerificationTemplate(verificationUrl)
  );

  if (!mailResponse?.success) {
    throw new ApiError(
      500,
      mailResponse?.message ||
        "Account created but verification email could not be sent"
    );
  }



  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
export const verifyEmail = async (token) => {
  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.EMAIL_VERIFICATION_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        400,
        "Verification link has expired. Please request a new verification email in login page using your credentials."
      );
    }

    throw new ApiError(
      400,
      "Invalid verification link."
    );
  }
   const userId = decoded?.userId;

  if (!userId) {
    throw new ApiError(
      400,
      "Invalid verification token."
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "User not found with this verification token."
    );
  }

  if (user.emailVerified) {
    throw new ApiError(
      400,
      "Email is already verified. You can now login."
    );
  }
    await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  return true;
};

export const loginUser = async (data) => {

    const payload = data;

 

    const validationSchema = zSchema.pick({
      email: true,
    }).extend({
      password: z.string(),
    });

    const validatedData = validationSchema.safeParse(payload);

  if (!validatedData.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const {  email, password } = validatedData.data;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid login credentials."
    );
  }


  // Verify password first
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordMatch) {
    throw new ApiError(
      400,
      "Invalid login credentials."
    );
  }

  // Check whether email is verified
  if (!user.emailVerified) {
    const verificationToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.EMAIL_VERIFICATION_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const verificationUrl =
      `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;

    const mailResponse = await sendMail(
      user.email,
      "Verify your Bullish Pixel account",
      emailVerificationTemplate(verificationUrl)
    );

    if (!mailResponse?.success) {
      throw new ApiError(
        500,
        "Failed to send verification email. Please try again."
      );
    }

    throw new ApiError(
      401,
      "Your email is not verified yet. We have sent you another verification email. Please verify your email to login."
    );
  }

  // Delete previous OTPs
  await prisma.otp.deleteMany({
    where: {
      email: user.email,
    },
  });

  // Generate new OTP
  const otp = generateOtp();

  // Hash OTP before saving
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Create OTP
  await prisma.otp.create({
    data: {
      email: user.email,
      otp: hashedOtp,

      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  });

  // Send actual OTP to user
  const mailResponse = await sendMail(
    user.email,
    "Your Bullish Pixel login code",
    otpEmailTemplate(otp)
  );

  if (!mailResponse?.success) {
    // Remove OTP because email was not delivered
    await prisma.otp.deleteMany({
      where: {
        email: user.email,
      },
    });

    throw new ApiError(
      500,
      "Failed to send OTP email. Please try again."
    );
  }

  return {
    email: user.email,
  };
};
export const sendOtp = async (email) => {



  // Delete previous OTPs
  await prisma.otp.deleteMany({
    where: {
      email,
    },
  });

  // Generate OTP
  const otp = generateOtp();

  // Hash OTP before storing
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Save OTP
  await prisma.otp.create({
    data: {
      email,
      otp: hashedOtp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  });

  // Send OTP email
  const mailResponse = await sendMail(
    email,
    "Your Bullish Pixel login code",
    otpEmailTemplate(otp)
  );

  if (!mailResponse?.success) {
    // Remove OTP because user never received it
    await prisma.otp.deleteMany({
      where: {
        email,
      },
    });

    throw new ApiError(
      500,
      "Failed to send OTP. Please try again."
    );
  }

  return true;
};

export const verifyOtp = async (data) => {
  const payload = data;

  const validationSchema = zSchema.pick({
    email: true,
    otp: true,
  });
  const validatedData = validationSchema.safeParse(payload);

  if (!validatedData.success) {
    throw new ApiError(400, "Invalid input data");
  }

  const { email, otp } = validatedData.data;

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // Check OTP expiration
  if (otpRecord.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // Compare entered OTP with hashed OTP
  const isOtpValid = await bcrypt.compare(
    otp,
    otpRecord.otp
  );

  if (!isOtpValid) {
    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(
      400,
      "Invalid OTP or email."
    );
  }

  // Create login token
  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Delete used OTP
  await prisma.otp.delete({
    where: {
      id: otpRecord.id,
    },
  });

  return {
    token,

    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
  };
};

export const sendForgotPasswordOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(
      404,
      "User with this email does not exist."
    );
  }

  // Remove previous OTPs
  await prisma.otp.deleteMany({
    where: {
      email,
    },
  });

  // Generate OTP
  const otp = generateOtp();

  // Hash OTP
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store OTP
  await prisma.otp.create({
    data: {
      email,
      otp: hashedOtp,

      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  });

  // Send OTP
  const mailResponse = await sendMail(
    email,
    "Reset your Bullish Pixel password",
    otpEmailTemplate(otp)
  );

  if (!mailResponse?.success) {
    await prisma.otp.deleteMany({
      where: {
        email,
      },
    });

    throw new ApiError(
      500,
      "Failed to send OTP email. Please try again."
    );
  }

  return true;
};

export const verifyForgotPasswordOtp = async ({
  email,
  otp,
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(
      400,
      "Invalid OTP or email."
    );
  }

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // Compare OTP with stored hash
  const isOtpValid = await bcrypt.compare(
    otp,
    otpRecord.otp
  );

  if (!isOtpValid) {
    throw new ApiError(
      400,
      "Invalid or expired OTP."
    );
  }

  // OTP can only be used once
  await prisma.otp.delete({
    where: {
      id: otpRecord.id,
    },
  });

  // Create temporary password reset token
  const resetToken = jwt.sign(
    {
      userId: user.id,
      purpose: "password-reset",
    },
    process.env.PASSWORD_RESET_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return {
    resetToken,
  };
};
export const resetPassword = async ({
  resetToken,
  password,
}) => {
  let decoded;

  try {
    decoded = jwt.verify(
      resetToken,
      process.env.PASSWORD_RESET_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        400,
        "Password reset session has expired. Please request a new OTP."
      );
    }

    throw new ApiError(
      400,
      "Invalid password reset token."
    );
  }

  if (
    !decoded?.userId ||
    decoded?.purpose !== "password-reset"
  ) {
    throw new ApiError(
      400,
      "Invalid password reset token."
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user || user.deletedAt) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },

    data: {
      passwordHash,
    },
  });

  return true;
};