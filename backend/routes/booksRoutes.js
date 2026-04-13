import express from "express";
import crypto from "crypto";

import {getAllBooks, getBook, createBook, updateBook, deleteBook} from "../controllers/bookController.js";

const router = express.Router();

router.get("/getAll", getAllBooks);
router.get("/getByRFID/:rfidTag", getBook);

router.post("/create", createBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

export default router;
