import express from "express";
import { startScan, stopScan } from "../controllers/scanController.js";

const router = express.Router();

router.post("/start", startScan);
router.post("/stop", stopScan);

export default router;
