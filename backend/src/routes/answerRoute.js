import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
    createAnswer,
    getAnswersByQuestion,
    updateAnswer,
    deleteAnswer,
    voteAnswer,
    acceptAnswer
} from "../controllers/answerController.js";

const router = express.Router();

// Lấy danh sách câu trả lời cho một câu hỏi (Public)
router.get("/:quesId", getAnswersByQuestion);

// Đăng câu trả lời mới (Cần đăng nhập)
router.post("/:quesId", protectedRoute, createAnswer);

// Cập nhật câu trả lời (Cần đăng nhập)
router.put("/:id", protectedRoute, updateAnswer);

// Xóa câu trả lời (Cần đăng nhập)
router.delete("/:id", protectedRoute, deleteAnswer);

// Vote câu trả lời (Upvote/Downvote) (Cần đăng nhập)
router.post("/:id/vote", protectedRoute, voteAnswer);

// Đánh dấu câu trả lời đúng (Chủ câu hỏi mới được phép)
router.patch("/:id/accept", protectedRoute, acceptAnswer);

export default router;
