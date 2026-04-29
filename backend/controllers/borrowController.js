import { Borrow } from "../models/Borrow.js";
import { Book } from "../models/Book.js";
import { User } from "../models/User.js";


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

    console.log("BORROW REQUEST BODY:", req.body);

    /* =========================
       STEP 1: VALIDATION
    ========================= */
    if (!user || !book) {
      return res.status(400).json({
        success: false,
        step: "VALIDATION",
        message: "User and Book are required",
        received: req.body
      });
    }

    /* =========================
       STEP 2: FIND USER
    ========================= */
    const existingUser = await User.findById(user);

    console.log("USER FOUND:", existingUser);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        step: "USER_LOOKUP",
        message: "User not found",
        userId: user
      });
    }

    /* =========================
       STEP 3: BAN CHECK
    ========================= */
    if (
      existingUser.banned === true ||
      existingUser.banned === "true" ||
      existingUser.banned === 1
    ) {
      return res.status(403).json({
        success: false,
        step: "BAN_CHECK",
        message: "User is banned from borrowing books",
        userId: user
      });
    }

    /* =========================
       STEP 4: FIND BOOK
    ========================= */
    const existingBook = await Book.findById(book);

    console.log("BOOK FOUND:", existingBook);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        step: "BOOK_LOOKUP",
        message: "Book not found",
        bookId: book
      });
    }

    /* =========================
       STEP 5: BOOK AVAILABILITY
    ========================= */
    if (!existingBook.available) {
      return res.status(400).json({
        success: false,
        step: "BOOK_AVAILABILITY_CHECK",
        message: "Book is already borrowed",
        debug: {
          bookId: book,
          available: existingBook.available
        }
      });
    }

    /* =========================
       STEP 6: OVERDUE CHECK
    ========================= */
    const hasOverdue = await Borrow.findOne({
      user,
      returned: false,
      dueDate: { $lt: new Date() }
    });

    if (hasOverdue) {
      return res.status(400).json({
        success: false,
        step: "OVERDUE_CHECK",
        message: "User has overdue books",
        debug: {
          overdueBorrowId: hasOverdue._id,
          dueDate: hasOverdue.dueDate
        }
      });
    }

    /* =========================
       STEP 7: CREATE BORROW
    ========================= */
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const newBorrow = new Borrow({
      user,
      book,
      dueDate
    });

    await newBorrow.save();

    await Book.findByIdAndUpdate(book, { available: false });

    /* =========================
       STEP 8: UPDATE USER BORROW HISTORY
    ========================= */
    await User.findByIdAndUpdate(user, {
      $push: {
        borrowHistory: newBorrow._id
      }
    });

    return res.status(201).json({
      success: true,
      step: "SUCCESS",
      message: "Borrow created successfully",
      borrow: newBorrow
    });

  } catch (error) {
    console.error("Error creating borrow:", error);

    return res.status(500).json({
      success: false,
      step: "SERVER_ERROR",
      message: error.message,
      stack: error.stack
    });
  }
};


/* =========================
   RETURN BOOK
========================= */
export const returnBookByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;

    console.log("RETURN REQUEST FOR BOOK:", bookId);

    if (!bookId) {
      return res.status(400).json({
        success: false,
        step: "VALIDATION",
        message: "bookId is required"
      });
    }

    /* =========================
       FIND ACTIVE BORROW
    ========================= */
    const borrow = await Borrow.findOne({
      book: bookId,
      returned: false
    })
      .populate("user", "username")
      .populate("book", "title available");

    console.log("ACTIVE BORROW FOUND:", borrow);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        step: "BORROW_LOOKUP",
        message: "No active borrow found for this book",
        debug: {
          bookId
        }
      });
    }

    /* =========================
       ALREADY RETURNED SAFETY
    ========================= */
    if (borrow.returned === true) {
      return res.status(400).json({
        success: false,
        step: "RETURN_STATE",
        message: "This borrow record is already returned",
        borrowId: borrow._id
      });
    }

    /* =========================
       FINE CALCULATION
    ========================= */
    const today = new Date();
    let fine = 0;

    if (today > borrow.dueDate) {
      const lateDays = Math.ceil(
        (today - borrow.dueDate) / (1000 * 60 * 60 * 24)
      );

      fine = lateDays * 10;
    }

    /* =========================
       UPDATE BORROW
    ========================= */
    borrow.returned = true;
    borrow.returnDate = today;
    borrow.status = today > borrow.dueDate ? "overdue" : "returned";
    borrow.fine = fine;

    await borrow.save();

    /* =========================
       UPDATE BOOK SAFELY
    ========================= */
    await Book.findOneAndUpdate(
      { _id: bookId },
      { available: true }
    );

    /* =========================
       RESPONSE
    ========================= */
    return res.status(200).json({
      success: true,
      step: "SUCCESS",
      message: "Book returned successfully",
      fine,
      borrow
    });

  } catch (error) {
    console.error("Return by book error:", error);

    return res.status(500).json({
      success: false,
      step: "SERVER_ERROR",
      message: error.message,
      stack: error.stack
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