import express from "express";
import { getReports, approveReport, rejectReport, deleteReport } from "../controllers/reportController.js";

const router = express.Router();

// Lấy danh sách báo cáo
router.get("/", getReports);

// Duyệt qua (false positive)
router.patch("/:id/approve", approveReport);

// Từ chối (xác nhận vi phạm)
router.patch("/:id/reject", rejectReport);

// Xóa báo cáo
router.delete("/:id", deleteReport);

export default router;
