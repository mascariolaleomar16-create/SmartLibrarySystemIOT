import express from "express";

const router = express.Router();
import {findOverdueStudents} from "../controllers/monitorController.js"


router.get("/overdue", findOverdueStudents);

export default router;