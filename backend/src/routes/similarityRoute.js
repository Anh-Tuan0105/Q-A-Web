import express from 'express';
import { getSimilarQuestions } from '../controllers/similarity.controller.js';

const router = express.Router();

// POST /api/similarity/questions
// Public route - không cần auth để có thể check khi người dùng chưa đăng nhập
router.post('/questions', getSimilarQuestions);

export default router;
