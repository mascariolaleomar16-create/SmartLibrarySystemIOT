import express from "express";
import {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.patch("/:id/ban", banUser);
router.patch("/:id/unban", unbanUser);

export default router;