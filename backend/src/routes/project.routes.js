import { Router } from "express";
import {
  getProjectById,
  getProjects,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
