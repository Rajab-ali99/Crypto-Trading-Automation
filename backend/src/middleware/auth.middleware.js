import jwt from "jsonwebtoken";

import prisma from "../config/database.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(
  async (req, res, next) => {
    const token = req.cookies?.Token_Access;

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        status: true,
        plan: true,
      },
    });

    if (!user) {
      throw new ApiError(
        401,
        "Invalid authentication token"
      );
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(
        403,
        "Your account is not active"
      );
    }

    req.user = user;

    next();
  }
);

export default authenticate;