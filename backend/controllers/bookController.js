import crypto from "crypto";
import { Book } from "../models/Book.js";
import { Borrow } from "../models/Borrow.js";


/* =========================
   GET ALL BOOKS
   (WITH BORROW STATUS FLAG)
========================= */
export const getAllBooks = async (req, res) => {
  try {

    const books = await Book.find({
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    });

    // Get active borrows (not returned)
    const activeBorrows = await Borrow.find({
      returned: false
    }).select("book dueDate user");

    // Map for quick lookup
    const borrowMap = new Map();

    activeBorrows.forEach((b) => {
      borrowMap.set(b.book.toString(), {
        dueDate: b.dueDate,
        user: b.user
      });
    });

    // Attach status to books
    const booksWithStatus = books.map((book) => {
      const borrowInfo = borrowMap.get(book._id.toString());

      return {
        ...book.toObject(),
        isBorrowed: !!borrowInfo,
        dueDate: borrowInfo ? borrowInfo.dueDate : null
      };
    });

    return res.status(200).json({
      success: true,
      count: booksWithStatus.length,
      books: booksWithStatus
    });

  } catch (err) {

    console.error("Error fetching books:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books"
    });
  }
};


/* =========================
   GET BOOK BY RFID
   (WITH BORROW STATUS)
========================= */
export const getBookByRFID = async (req, res) => {
  try {

    const rfidTag = req.params.rfidTag;

    const book = await Book.findOne({ rfidTag, isDeleted: false });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const borrow = await Borrow.findOne({
      book: book._id,
      returned: false
    }).populate("user", "username fullName email");

    return res.status(200).json({
      success: true,
      book: {
        ...book.toObject(),
        isBorrowed: !!borrow,
        borrowedBy: borrow ? borrow.user : null,
        dueDate: borrow ? borrow.dueDate : null
      }
    });

  } catch (err) {

    console.error("Error fetching book:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book"
    });
  }
};


/* =========================
   CREATE BOOK
========================= */
export const createBook = async (req, res) => {
  try {

    const {
      title,
      author,
      rfidTag,
      isbn,
      description,
      category,
      shelfNumber
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: "Title and author are required"
      });
    }

    let finalRFID = rfidTag;

    if (!finalRFID) {
      finalRFID = `RFID-${Date.now().toString(36)}-${crypto
        .randomBytes(3)
        .toString("hex")}`;
    }

    const rfidExists = await Book.findOne({ rfidTag: finalRFID });

    if (rfidExists) {
      return res.status(400).json({
        success: false,
        message: "RFID already exists"
      });
    }

    if (isbn) {
      const isbnExists = await Book.findOne({ isbn });

      if (isbnExists) {
        return res.status(400).json({
          success: false,
          message: "ISBN already exists"
        });
      }
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      description,
      category: category || "General",
      rfidTag: finalRFID,
      shelfNumber: shelfNumber || "Unassigned"
    });

    await newBook.save();

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: newBook
    });

  } catch (err) {

    console.error("Create book error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create book"
    });
  }
};

export const updateBook = async (req, res) => {
  try {

    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book || book.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook
    });

  } catch (err) {

    console.error("Update book error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to update book"
    });
  }
};

export const deleteBook = async (req, res) => {
  try {

    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book || book.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    book.isDeleted = true;
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book marked as deleted"
    });

  } catch (err) {

    console.error("Delete book error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete book"
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      _id: id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const borrow = await Borrow.findOne({
      book: id,
      returned: false
    }).populate("user", "username fullName email");

    return res.status(200).json({
      success: true,
      book: {
        ...book.toObject(),
        isBorrowed: !!borrow,
        borrowedBy: borrow ? borrow.user : null,
        dueDate: borrow ? borrow.dueDate : null
      }
    });

  } catch (err) {
    console.error("Error fetching book by ID:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book"
    });
  }
};


export default {
  getAllBooks,
  getBookByRFID,
  createBook,
  updateBook,
  deleteBook,
  getBookById
};