import express from "express";
import { getPopularTags, getTags, incrementTagView } from "../controllers/tagController.js";

const router = express.Router();

router.get("/popular", getPopularTags);
router.get("/", getTags);
router.put("/:name/view", incrementTagView);

export default router;
