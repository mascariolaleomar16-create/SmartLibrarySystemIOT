import { Borrow } from "../models/Borrow.js";
import { Book } from "../models/Book.js";
import { User } from "../models/User.js";
import Notification from "../models/Notification.js";
import { PenaltyLog } from "../models/PenaltyLog.js";

const BORROW_DAYS = 3;
const FINE_PER_DAY = 10;
const BAN_THRESHOLD = 200;

/* =========================
   GET ALL BORROWS
========================= */
export const getAllBorrows = async (req, res) => {
  try {

    const borrows = await Borrow.find()
      .populate("user", "username fullName email")
      .populate("book", "title author rfidTag")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrows"
    });
  }
};


/* =========================
   GET SINGLE BORROW
========================= */
export const getBorrow = async (req, res) => {
  try {

    const borrow = await Borrow.findById(req.params.id)
      .populate("user", "username fullName email")
      .populate("book", "title author rfidTag");

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found"
      });
    }

    res.status(200).json({
      success: true,
      borrow
    });

  } catch (error) {
    console.error("Error fetching borrow:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrow"
    });
  }
};


/* =========================
   GET BORROWS BY USER
========================= */
export const getUserBorrows = async (req, res) => {
  try {

    const borrows = await Borrow.find({ user: req.params.userId })
      .populate("book", "title author rfidTag")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching user borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user borrows"
    });
  }
};


/* =========================
   GET OVERDUE BORROWS
========================= */
export const getOverdueBorrows = async (req, res) => {
  try {

    const today = new Date();

    const borrows = await Borrow.find({
      dueDate: { $lt: today },
      returned: false
    })
      .populate("user", "username email")
      .populate("book", "title author");

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching overdue borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overdue borrows"
    });
  }
};


/* =========================
   GET DUE SOON
========================= */
export const getDueSoonBorrows = async (req, res) => {
  try {

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const borrows = await Borrow.find({
      dueDate: { $gte: today, $lte: tomorrow },
      returned: false
    })
      .populate("user", "username email")
      .populate("book", "title author");

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching due soon borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch due soon borrows"
    });
  }
};


/* =========================
   CREATE BORROW
========================= */
export const createBorrow = async (req, res) => {
  try {
    const { user, book } = req.body;

    if (!user || !book) {
      return res.status(400).json({
        success: false,
        message: "User and Book are required"
      });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* =========================
       BAN CHECK
    ========================= */
    if (existingUser.banned) {
      return res.status(403).json({
        success: false,
        message: "User is banned"
      });
    }

    const existingBook = await Book.findById(book);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    if (!existingBook.available) {
      return res.status(400).json({
        success: false,
        message: "Book already borrowed"
      });
    }

    /* =========================
       OVERDUE CHECK
    ========================= */
    const hasOverdue = await Borrow.findOne({
      user,
      returned: false,
      dueDate: { $lt: new Date() }
    });

    if (hasOverdue) {
      return res.status(400).json({
        success: false,
        message: "User has overdue books"
      });
    }

    /* =========================
       ACTIVE BORROW LIMIT (MAX 3)
    ========================= */
    const activeBorrowsCount = await Borrow.countDocuments({
      user,
      returned: false
    });

    if (activeBorrowsCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Borrow limit reached. You can only borrow up to 3 books at a time."
      });
    }

    /* =========================
       CREATE BORROW
    ========================= */
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

    const newBorrow = new Borrow({
      user,
      book,
      dueDate
    });

    await newBorrow.save();

    await Book.findByIdAndUpdate(book, { available: false });

    await User.findByIdAndUpdate(user, {
      $push: { borrowHistory: newBorrow._id }
    });

    /* =========================
       NOTIFICATION (SAFE)
    ========================= */
    const existingNotif = await Notification.findOne({
      userId: user,
      type: "borrow",
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }
    });

    if (!existingNotif) {
      await Notification.create({
        userId: user,
        title: "Book Borrowed",
        message: `You borrowed "${existingBook.title}" successfully.`,
        type: "borrow"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Borrow created successfully",
      borrow: newBorrow
    });

  } catch (error) {
    console.error("Error creating borrow:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================
   RETURN BOOK
========================= */
export const returnBookByBookId = async (req, res) => {
  try {

    const { bookId } = req.params;

    const borrow = await Borrow.findOne({
      book: bookId,
      returned: false
    }).populate("user book");

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "No active borrow found"
      });
    }

    const today = new Date();

    let fine = 0;
    let lateDays = 0;

    if (today > borrow.dueDate) {
      lateDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );

      fine = lateDays * FINE_PER_DAY;
    }

    /* =========================
       UPDATE BORROW
    ========================= */
    borrow.returned = true;
    borrow.returnDate = today;
    borrow.status = fine > 0 ? "overdue" : "returned";
    borrow.fine = fine;

    await borrow.save();

    /* =========================
       PENALTY LOG (FIXED FIELD)
    ========================= */
    if (fine > 0) {
      await PenaltyLog.create({
        user: borrow.user._id,
        borrow: borrow._id,
        overdueDays: lateDays,
        fineApplied: fine,
        reason: "Late return"
      });
    }

    await Book.findByIdAndUpdate(bookId, { available: true });

    /* =========================
       SYNC USER FINE (CRON SOURCE OF TRUTH)
    ========================= */
    const userBorrows = await Borrow.find({ user: borrow.user._id });

    const totalFine = userBorrows.reduce(
      (sum, b) => sum + (b.fine || 0),
      0
    );

    const user = await User.findById(borrow.user._id);

    user.fineAmount = totalFine;

    if (totalFine >= BAN_THRESHOLD) {
      user.banned = true;
    }

    await user.save();

    /* =========================
       NOTIFICATION (NO DUPLICATES)
    ========================= */
    const notifKey = `${borrow._id}-${fine > 0 ? "penalty" : "return"}`;

    const exists = await Notification.findOne({
      userId: user._id,
      type: fine > 0 ? "penalty" : "return",
      message: { $regex: notifKey, $options: "i" }
    });

    if (!exists) {
      await Notification.create({
        userId: user._id,
        title: fine > 0 ? "Penalty Applied" : "Book Returned",
        message: fine > 0
          ? `You returned "${borrow.book.title}" with ₱${fine} penalty. (${notifKey})`
          : `You returned "${borrow.book.title}" successfully. (${notifKey})`,
        type: fine > 0 ? "penalty" : "return"
      });
    }

    return res.status(200).json({
      success: true,
      fine,
      borrow
    });

  } catch (error) {
    console.error("Return error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* =========================
   USER BORROW FILTERS (UNCHANGED)
========================= */
export const getUserOverdueBorrows = async (req, res) => {
  try {

    const today = new Date();

    const borrows = await Borrow.find({
      user: req.params.userId,
      returned: false,
      dueDate: { $lt: today }
    })
      .populate("book", "title author rfidTag")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching user overdue borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user overdue borrows"
    });
  }
};


export const getUserDueSoonBorrows = async (req, res) => {
  try {

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const borrows = await Borrow.find({
      user: req.params.userId,
      returned: false,
      dueDate: { $gte: today, $lte: tomorrow }
    })
      .populate("book", "title author rfidTag")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: borrows.length,
      borrows
    });

  } catch (error) {
    console.error("Error fetching user due soon borrows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user due soon borrows"
    });
  }
};