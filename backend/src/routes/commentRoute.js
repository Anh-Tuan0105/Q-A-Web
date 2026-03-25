import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { createComment, getComments, deleteComment, updateComment } from "../controllers/commentController.js";

const router = express.Router();

// Lấy danh sách comment (Public)
router.get("/:targetType/:targetId", getComments);

// Tạo comment (Cần đăng nhập)
router.post("/:targetType/:targetId", protectedRoute, createComment);

// Xóa comment (Cần đăng nhập)
router.delete("/:id", protectedRoute, deleteComment);

// Cập nhật comment (Cần đăng nhập)
router.put("/:id", protectedRoute, updateComment);

export default router;
