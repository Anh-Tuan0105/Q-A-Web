import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    voteQuestion
} from "../controllers/questionController.js";

const router = express.Router();

// Lấy danh sách câu hỏi (Public)
router.get("/", getQuestions);

// Lấy chi tiết câu hỏi (Public)
router.get("/:id", getQuestionById);

// Đăng câu hỏi mới (Cần đăng nhập)
router.post("/", protectedRoute, createQuestion);

// Cập nhật câu hỏi (Cần đăng nhập)
router.put("/:id", protectedRoute, updateQuestion);

// Xóa câu hỏi (Cần đăng nhập)
router.delete("/:id", protectedRoute, deleteQuestion);

// Vote câu hỏi (Upvote/Downvote) (Cần đăng nhập)
router.post("/:id/vote", protectedRoute, voteQuestion);

export default router;
