import { Borrow } from "../models/Borrow.js";
import { Book } from "../models/Book.js";


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

    // Check if book exists
    const existingBook = await Book.findById(book);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if book is available
    if (!existingBook.available) {
      return res.status(400).json({
        success: false,
        message: "Book is currently not available"
      });
    }

    // Prevent borrowing if user has overdue books
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

    // 3-day limit
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const newBorrow = new Borrow({
      user,
      book,
      dueDate
    });

    await newBorrow.save();

    // Update book availability
    await Book.findByIdAndUpdate(book, { available: false });

    res.status(201).json({
      success: true,
      message: "Borrow created successfully",
      borrow: newBorrow
    });

  } catch (error) {

    console.error("Error creating borrow:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create borrow"
    });

  }
};


/* =========================
   RETURN BOOK
========================= */
export const returnBook = async (req, res) => {
  try {

    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found"
      });
    }

    if (borrow.returned) {
      return res.status(400).json({
        success: false,
        message: "Book already returned"
      });
    }

    const today = new Date();
    let fine = 0;

    // Check overdue
    if (today > borrow.dueDate) {
      const lateDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );

      fine = lateDays * 10; // ₱10/day
    }

    borrow.returned = true;
    borrow.returnDate = today;
    borrow.status = today > borrow.dueDate ? "overdue" : "returned";
    borrow.fine = fine;

    await borrow.save();

    // Make book available again
    await Book.findByIdAndUpdate(borrow.book, { available: true });

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
      fine,
      borrow
    });

  } catch (error) {

    console.error("Error returning book:", error);

    res.status(500).json({
      success: false,
      message: "Failed to return book"
    });

  }
};

/* GET USER OVERDUE BORROWS */
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

/* GET USER DUE SOON BORROWS */
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


export default {
  getAllBorrows,
  getBorrow,
  getUserBorrows,
  getOverdueBorrows,
  getDueSoonBorrows,
  createBorrow,
  returnBook,
  getUserOverdueBorrows,
  getUserDueSoonBorrows
};