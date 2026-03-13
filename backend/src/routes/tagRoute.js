import express from "express";
import { getPopularTags, getTags, incrementTagView, suggestTags } from "../controllers/tagController.js";

const router = express.Router();

router.get("/popular", getPopularTags);
router.get("/", getTags);
router.put("/:name/view", incrementTagView);
router.post("/suggest", suggestTags);

export default router;
