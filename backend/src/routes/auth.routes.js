import { Router } from "express";
import { getMe, login, logout } from "../controllers/auth.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginValidator } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginValidator), login);
router.get("/me", protect, requireAdmin, getMe);
router.post("/logout", protect, requireAdmin, logout);

export default router;
