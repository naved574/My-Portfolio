import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { PublicUser } from "../models/PublicUser.js";
import { ApiError } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const readBearerToken = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authentication token is required.");
  }
  return token;
};

export const protectUser = asyncHandler(async (req, res, next) => {
  const token = readBearerToken(req);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.type !== "user" || !decoded.sub) {
      throw new ApiError(401, "Invalid user token.");
    }

    const user = await PublicUser.findById(decoded.sub);
    if (!user) {
      throw new ApiError(401, "User no longer exists.");
    }

    req.user = user;
    req.authType = "user";
    return next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired token.");
  }
});

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const token = readBearerToken(req);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.type !== "admin") {
      throw new ApiError(403, "Admin access is required.");
    }

    req.admin = {
      email: decoded.email || env.ADMIN_EMAIL,
      role: "admin",
    };
    req.authType = "admin";
    return next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired token.");
  }
});
