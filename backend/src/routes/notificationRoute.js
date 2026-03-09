import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Lấy danh sách thông báo
router.get("/", protectedRoute, getNotifications);

// Đánh dấu tất cả đã đọc (Cần đặt trước /:id/read để tránh lỗi nhầm route params)
router.put("/read-all", protectedRoute, markAllAsRead);

// Đánh dấu 1 thông báo là đã đọc
router.put("/:id/read", protectedRoute, markAsRead);

export default router;
