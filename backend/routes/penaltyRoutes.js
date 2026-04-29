import express from "express";
import { PenaltyLog } from "../models/PenaltyLog.js";

const router = express.Router();

/* =========================
   GET ALL PENALTY HISTORY
========================= */
//no need for controller file since it's only one route
router.get("/", async (req, res) => {
  try {
    const logs = await PenaltyLog.find()
      .populate("user", "username email")
      .populate({
        path: "borrow",
        populate: { path: "book", select: "title" },
      })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch penalty logs" });
  }
});

export default router;