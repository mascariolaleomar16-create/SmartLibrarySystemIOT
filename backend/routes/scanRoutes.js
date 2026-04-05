import express from "express";
import { handleScan, startScan, stopScan } from "../controllers/scanController.js";

const router = express.Router();

router.post("/", handleScan);
router.post("/start", startScan);
router.post("/stop", stopScan);

export default router;
