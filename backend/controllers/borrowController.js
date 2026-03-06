import Borrow from "../models/Borrow.js";

export const getBorrowSummary = async (req, res) => {
  try {
    const summary = await Borrow.aggregate([
      { $match: { returned: false } },
      { $group: { _id: "$student", quantity: { $sum: 1 }, lastBorrowed: { $max: "$borrowDate" } } },
      { $lookup: { from: "students", localField: "_id", foreignField: "_id", as: "student" } },
      { $unwind: "$student" },
      { $project: { _id: 0, studentId: "$student._id", studentName: "$student.name", quantity: 1, lastBorrowed: 1 } },
      { $sort: { studentName: 1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Failed to load borrow summary" });
  }
};

export const getActiveBorrows = async (req, res) => {
  try {
    const list = await Borrow.find({ returned: false }).populate("student book");
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to load active borrows" });
  }
};

export default {
  getBorrowSummary,
  getActiveBorrows,
};
