import express from "express";
import crypto from "crypto";

import {getAllBooks, getBook, createBook} from "../controllers/bookController.js";

const router = express.Router();

router.get("/getAll", getAllBooks);
router.get("/getByID/:id", getBook);

router.post("/create", createBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

export default router;
