import crypto from "crypto";
import { Book } from "../models/Book.js";


/* GET ALL BOOKS */
export const getAllBooks = async (req, res) => {
  try {

    const books = await Book.find()
      .populate("borrowedBy", "username fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books
    });

  } catch (err) {

    console.error("Error fetching books:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books"
    });
  }
};


/* GET SINGLE BOOK */
export const getBook = async (req, res) => {

  try {

    const book = await Book.findById(req.params.id)
      .populate("borrowedBy", "username fullName");

    if (!book) {
      return res.status(404).json({
        success:false,
        message:"Book not found"
      });
    }

    return res.status(200).json({
      success:true,
      book
    });

  } catch (err) {

    console.error("Error fetching book:", err);

    return res.status(500).json({
      success:false,
      message:"Failed to fetch book"
    });

  }
};


/* CREATE BOOK */
export const createBook = async (req, res) => {

  try {

    const { title, author, rfidTag, isbn, description, category } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success:false,
        message:"Title and author are required"
      });
    }

    let finalRFID = rfidTag;

    /* Generate RFID if missing */
    if (!finalRFID) {

      finalRFID = `RFID-${Date.now().toString(36)}-${crypto
        .randomBytes(3)
        .toString("hex")}`;

    }

    /* Check duplicate RFID */
    const rfidExists = await Book.findOne({ rfidTag: finalRFID });

    if (rfidExists) {
      return res.status(400).json({
        success:false,
        message:"RFID already exists"
      });
    }

    /* Check duplicate ISBN */
    if (isbn) {

      const isbnExists = await Book.findOne({ isbn });

      if (isbnExists) {
        return res.status(400).json({
          success:false,
          message:"ISBN already exists"
        });
      }

    }

    const newBook = new Book({
      title,
      author,
      isbn,
      description,
      category: category || "General",
      rfidTag: finalRFID
    });

    await newBook.save();

    return res.status(201).json({
      success:true,
      message:"Book added successfully",
      book:newBook
    });

  } catch (err) {

    console.error("Create book error:", err);

    return res.status(500).json({
      success:false,
      message:"Failed to create book"
    });

  }

};


/* UPDATE BOOK */
export const updateBook = async (req, res) => {

  try {

    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success:false,
        message:"Book not found"
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      { new:true }
    );

    return res.status(200).json({
      success:true,
      message:"Book updated successfully",
      book:updatedBook
    });

  } catch (err) {

    console.error("Update book error:", err);

    return res.status(500).json({
      success:false,
      message:"Failed to update book"
    });

  }

};


/* DELETE BOOK */
export const deleteBook = async (req, res) => {

  try {

    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success:false,
        message:"Book not found"
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success:true,
      message:"Book deleted successfully"
    });

  } catch (err) {

    console.error("Delete book error:", err);

    return res.status(500).json({
      success:false,
      message:"Failed to delete book"
    });

  }

};


export default {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};