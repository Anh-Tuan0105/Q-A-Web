import express from "express";
import { signUp, signIn, logOut, refreshToken, changePassword, requestEmailChange, verifyEmailChange, adminLogin } from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logOut);
router.post("/refresh", refreshToken);

router.post("/change-password", protectedRoute, changePassword);
router.post("/request-email-change", protectedRoute, requestEmailChange);
router.post("/verify-email-change", protectedRoute, verifyEmailChange);

router.post("/admin/login", adminLogin);

export default router;