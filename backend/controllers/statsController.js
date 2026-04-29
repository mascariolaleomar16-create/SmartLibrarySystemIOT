import {Book} from "../models/Book.js";
import {User} from "../models/User.js";
import {Borrow} from "../models/Borrow.js";

/* =========================
   OVERVIEW STATS
========================= */
const getOverviewStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();

    const activeBorrows = await Borrow.countDocuments({
      returned: false,
    });

    const overdueBorrows = await Borrow.countDocuments({
      returned: false,
      dueDate: { $lt: new Date() },
    });

    const returnedToday = await Borrow.countDocuments({
      returned: true,
      returnedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    });

    res.json({
      success: true,
      data: {
        totalBooks,
        totalUsers,
        activeBorrows,
        overdueBorrows,
        returnedToday,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   MOST BORROWED BOOKS
========================= */
const getMostBorrowedBooks = async (req, res) => {
  try {
    const data = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   OVERDUE LIST
========================= */
const getOverdueBooks = async (req, res) => {
  try {
    const data = await Borrow.find({
      returned: false,
      dueDate: { $lt: new Date() },
    })
      .populate("book")
      .populate("user");

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/* =========================
   DAILY BORROW STATS
========================= */
const getBorrowTrend = async (req, res) => {
  try {
    const data = await Borrow.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$borrowDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export {
  getOverviewStats,
  getMostBorrowedBooks,
  getOverdueBooks,
  getBorrowTrend,
}