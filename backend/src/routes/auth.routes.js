import { Router } from "express";
import {
  adminLogin,
  getAdminMe,
  getMe,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectAdmin, protectUser } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginValidator, signupValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate(signupValidator), signup);
router.post("/login", validate(loginValidator), login);
router.get("/me", protectUser, getMe);
router.post("/logout", protectUser, logout);

router.post("/admin/login", validate(loginValidator), adminLogin);
router.get("/admin/me", protectAdmin, getAdminMe);
router.post("/admin/logout", protectAdmin, logout);

export default router;
