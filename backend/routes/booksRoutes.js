import express from "express";
import { uploadSingleFile } from "../middleware/filehandling.js";

import {getAllBooks, getBookByRFID, createBook, updateBook, deleteBook, getBookById} from "../controllers/bookController.js";

const router = express.Router();

router.get("/getAll", getAllBooks);
router.get("/getByRFID/:rfidTag", getBookByRFID);
router.get("/getById/:id", getBookById);

router.post("/create", uploadSingleFile("image"), createBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

export default router;
