import { Router } from "express";
import {
  getProjectBySlug,
  getProjects,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

export default router;
