import express from "express";
import { getBorrowSummary, getActiveBorrows } from "../controllers/borrowController.js";

const router = express.Router();

router.get("/summary", getBorrowSummary);
router.get("/active", getActiveBorrows);

export default router;
