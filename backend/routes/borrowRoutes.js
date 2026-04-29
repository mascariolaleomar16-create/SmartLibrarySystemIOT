import express from "express";
import {
  getAllBorrows,
  getBorrow,
  getUserBorrows,
  getOverdueBorrows,
  getDueSoonBorrows,
  createBorrow,
  getUserOverdueBorrows,
  getUserDueSoonBorrows,
  returnBookByBookId,
} from "../controllers/borrowController.js";

const router = express.Router();


router.get("/", getAllBorrows);
router.get("/:id", getBorrow);
router.post("/", createBorrow);
router.put("/return-by-book/:bookId", returnBookByBookId);


router.get("/user/:userId", getUserBorrows);
router.get("/overdue/all", getOverdueBorrows);
router.get("/due-soon/all", getDueSoonBorrows);
router.get("/user/:userId/overdue", getUserOverdueBorrows);
router.get("/user/:userId/due-soon", getUserDueSoonBorrows);




export default router;