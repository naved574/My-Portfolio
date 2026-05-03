import { Router } from "express";
import { createContactMessage } from "../controllers/contact.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { contactValidator } from "../validators/contact.validator.js";

const router = Router();

router.post("/", validate(contactValidator), createContactMessage);

export default router;
