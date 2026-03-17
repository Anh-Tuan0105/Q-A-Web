import express from "express";
import { authMe, test, updateProfile, getAllUsers, banUser, unbanUser, updateReputation } from "../controllers/userController.js"
import { protectedRoute, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import User from "../models/User.js";
import Answer from "../models/Answer.js";


const router = express.Router();

router.get("/me", protectedRoute, authMe);
router.put("/profile", protectedRoute, upload.single("file"), updateProfile);

// Admin Routes
router.get("/admin/all", protectedRoute, adminOnly, getAllUsers);
router.post("/admin/sync-reputation", protectedRoute, adminOnly, async (req, res) => {
    try {
        const users = await User.find();
        const results = [];
        for (const user of users) {
            const answerVotes = await Answer.aggregate([
                { $match: { userId: user._id } },
                { $group: { _id: null, total: { $sum: { $subtract: ["$upvoteCount", "$downvoteCount"] } } } }
            ]);

            const realReputation = answerVotes[0]?.total || 0;
            await User.findByIdAndUpdate(user._id, { reputation: realReputation });
            results.push({ id: user._id, name: user.displayName, reputation: realReputation });
        }
        res.status(200).json({ success: true, message: "Đồng bộ hoàn tất", results });
    } catch (error) {
        console.error("Lỗi sync:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});
router.put("/:id/ban", protectedRoute, adminOnly, banUser);
router.put("/:id/unban", protectedRoute, adminOnly, unbanUser);
router.put("/:id/reputation", protectedRoute, adminOnly, updateReputation);

router.get("/test", test);

export default router
