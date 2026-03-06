import express from "express";
import crypto from "crypto";

import {getAllBooks, getByRFID, createBook} from "../controllers/bookController.js";

const router = express.Router();

router.get("/getAll", getAllBooks);
router.get("/getByID/:rfid", getAllBooks);

router.post("/create", createBook);

export default router;
