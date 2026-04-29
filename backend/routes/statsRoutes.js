import express from "express";
import {
  getOverviewStats,
  getMostBorrowedBooks,
  getOverdueBooks,
  getBorrowTrend,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/overview", getOverviewStats);
router.get("/most-borrowed", getMostBorrowedBooks);
router.get("/overdue", getOverdueBooks);
router.get("/trend", getBorrowTrend);

export default router;