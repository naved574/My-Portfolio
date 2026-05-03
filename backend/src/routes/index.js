import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactRoutes from "./contact.routes.js";
import profileRoutes from "./profile.routes.js";
import projectRoutes from "./project.routes.js";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../controllers/project.controller.js";
import {
  deleteContactMessage,
  getContactMessages,
  markContactMessageRead,
} from "../controllers/contact.controller.js";
import { updateProfile } from "../controllers/profile.controller.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProjectValidator,
  updateProjectValidator,
} from "../validators/project.validator.js";
import { updateProfileValidator } from "../validators/profile.validator.js";

const router = Router();
const adminOnly = [protect, requireAdmin];

router.get("/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/profile", profileRoutes);
router.use("/contact", contactRoutes);

router.post(
  "/admin/projects",
  ...adminOnly,
  validate(createProjectValidator),
  createProject
);
router.patch(
  "/admin/projects/:id",
  ...adminOnly,
  validate(updateProjectValidator),
  updateProject
);
router.delete("/admin/projects/:id", ...adminOnly, deleteProject);
router.patch(
  "/admin/profile",
  ...adminOnly,
  validate(updateProfileValidator),
  updateProfile
);
router.get("/admin/contact-messages", ...adminOnly, getContactMessages);
router.patch(
  "/admin/contact-messages/:id/read",
  ...adminOnly,
  markContactMessageRead
);
router.delete("/admin/contact-messages/:id", ...adminOnly, deleteContactMessage);

export default router;
