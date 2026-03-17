import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protectedRoute, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: Bất kỳ ai cũng có thể lấy cấu hình để hiển thị UI
router.get("/", getSettings);

// Admin Only: Cập nhật cấu hình
router.put("/", protectedRoute, adminOnly, updateSettings);

export default router;
