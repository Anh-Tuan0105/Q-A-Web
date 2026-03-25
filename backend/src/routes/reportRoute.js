import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { createUserReport } from "../controllers/userReportController.js";

const router = express.Router();

// User tạo report
router.post("/", protectedRoute, createUserReport);

export default router;
