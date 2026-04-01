import express from "express";

const router = express.Router();
import {findOverdueUsers} from "../controllers/monitorController.js"


router.get("/overdue", findOverdueUsers);

export default router;