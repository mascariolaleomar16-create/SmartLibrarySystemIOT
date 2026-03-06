import express from "express";
import { getAllBorrows, getBorrow, createBorrow, updateBorrow } from "../controllers/borrowController.js";

const router = express.Router();

router.get("/getAll", getAllBorrows);
router.get("/getByID/:id", getBorrow);
router.post("/create", createBorrow);
router.put("/update/:id", updateBorrow);

export default router;
