import express from "express";
import { getPopularTags, getTags, incrementTagView, suggestTags, createTag, updateTag, deleteTag } from "../controllers/tagController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/popular", getPopularTags);
router.get("/", getTags);
router.put("/:name/view", incrementTagView);
router.post("/suggest", suggestTags);

// Admin Routes
router.post("/", protectedRoute, createTag);
router.patch("/:id", protectedRoute, updateTag);
router.delete("/:id", protectedRoute, deleteTag);

export default router;
