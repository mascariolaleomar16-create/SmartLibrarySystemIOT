import express from "express";
import { login, verify, register, logout, me } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/verify", verify);
router.get("/me", me);
router.post("/logout", logout);
router.post("/register", register);

export default router;
