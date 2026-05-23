import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { PublicUser } from "../models/PublicUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createAdminToken, createUserToken } from "../utils/createToken.js";
import { isBlockedEmailDomain } from "../utils/emailBlocklist.js";
import { ApiError, sendSuccess } from "../utils/response.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match.");
  }

  if (isBlockedEmailDomain(email)) {
    throw new ApiError(400, "Disposable email domains are not allowed.");
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await PublicUser.findOne({ email: normalizedEmail }).select("_id");
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await PublicUser.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return sendSuccess(
    res,
    {
      token: createUserToken(user),
      user: user.toSafeJSON(),
    },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await PublicUser.findOne({ email: email.toLowerCase() }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return sendSuccess(res, {
    token: createUserToken(user),
    user: user.toSafeJSON(),
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const inputEmail = String(email || "").toLowerCase().trim();
  const adminEmail = String(env.ADMIN_EMAIL || "").toLowerCase().trim();

  if (!adminEmail || !env.ADMIN_PASSWORD) {
    throw new ApiError(500, "Admin credentials are not configured.");
  }

  if (inputEmail !== adminEmail || password !== env.ADMIN_PASSWORD) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  return sendSuccess(res, {
    token: createAdminToken(),
    user: {
      email: adminEmail,
      role: "admin",
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user.toSafeJSON() });
});

export const getAdminMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.admin });
});

export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: "Logged out successfully." });
});
