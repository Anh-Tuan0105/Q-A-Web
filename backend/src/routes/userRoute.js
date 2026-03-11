import express from "express";
import { authMe, test, updateProfile } from "../controllers/userController.js"
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protectedRoute, authMe);
router.put("/profile", protectedRoute, upload.single("avatar"), updateProfile);

router.get("/test", test);

export default router
