import crypto from "crypto";
import { Book } from "../models/Book.js"

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (err) {
    console.error("Error fetching books:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, rfidTag, isbn, description } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    let finalRFID = rfidTag;

    // Generate RFID if not provided
    if (!finalRFID) {
      finalRFID = `RFID-${Date.now().toString(36)}-${crypto
        .randomBytes(3)
        .toString("hex")}`;
    }

    // ✅ Check for duplicate RFID
    const existingBook = await Book.findOne({ rfidTag: finalRFID });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "RFID already exists. Please use a unique RFID tag.",
      });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      description,
      rfidTag: finalRFID, // save correctly
    });

    await newBook.save(); // ✅ Save to database

    return res.status(201).json({
      success: true,
      message: "Book added successfully.",
      book: newBook,
    });
  } catch (err) {
    console.log("Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
};

export default {
    getAllBooks,
    createBook,
}