import Borrow from "../models/Borrow.js";
import mongoose from "mongoose";

export const findOverdueStudents = async (req, res) => {
    try {
        if (!mongoose.connection || mongoose.connection.readyState !== 1) {
            return res.json([]);
        }
        const today = new Date();
        const overdue = await Borrow.find({
            dueDate:{ $lt: today },
            returned:false
        }).populate("student book");
        res.json(overdue);
    } catch (err) {
        res.status(500).json({ error: "Failed to load overdue" });
    }
}

export default {};
