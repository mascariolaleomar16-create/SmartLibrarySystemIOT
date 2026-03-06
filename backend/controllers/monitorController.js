import { Borrow } from "../models/Borrow.js";
import mongoose from "mongoose";

export const findOverdueUsers = async (req, res) => {
  try {

    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const today = new Date();

    const overdue = await Borrow.find({
      dueDate: { $lt: today },
      returned: false
    })
    .populate("user", "username fullName email")
    .populate("book", "title author rfidTag");

    res.json({
      success: true,
      count: overdue.length,
      overdue
    });

  } catch (err) {

    console.error("Failed to load overdue:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load overdue borrows"
    });

  }
};

export default {
  findOverdueUsers
};