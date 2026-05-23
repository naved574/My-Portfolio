import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const createUserToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      type: "user",
      email: user.email,
    },
    env.JWT_SECRET,
    { expiresIn: env.USER_JWT_EXPIRES_IN || "7d" }
  );

export const createAdminToken = () =>
  jwt.sign(
    {
      type: "admin",
      email: env.ADMIN_EMAIL,
      role: "admin",
    },
    env.JWT_SECRET,
    { expiresIn: env.ADMIN_JWT_EXPIRES_IN || env.JWT_EXPIRES_IN || "7d" }
  );
