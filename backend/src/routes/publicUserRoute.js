import express from "express";
import * as userController from "../controllers/userController.js";
import { optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:id", optionalAuth, userController.getUserProfile);
router.put("/profile/:id/view", optionalAuth, userController.incrementProfileView);
router.get("/profile/:id/questions", optionalAuth, userController.getUserQuestions);
router.get("/profile/:id/answers", optionalAuth, userController.getUserAnswers);

router.get("/", userController.getMembers);

export default router;
