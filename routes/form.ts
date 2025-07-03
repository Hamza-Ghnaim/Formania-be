import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { createForm } from "../controllers/form.js";
///import { createForm } from "../controllers/form.js";/
const router = express.Router();

router.post("/", authenticateUser, createForm);

export default router;
