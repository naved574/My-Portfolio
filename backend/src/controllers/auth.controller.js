import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/createToken.js";
import { ApiError, sendSuccess } from "../utils/response.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return sendSuccess(res, {
    token: createToken(user),
    user: user.toSafeJSON(),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user.toSafeJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: "Logged out successfully." });
});
