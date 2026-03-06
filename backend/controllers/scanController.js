import { Book } from "../models/Book.js";
import Borrow from "../models/Borrow.js";

export const handleScan = async (req, res) => {
  try {
    const { rfid, studentId } = req.body;

    const book = await Book.findOne({ rfidTag: rfid });

    if (!book) {
      return res.json({ message: "Book not found" });
    }

    // BORROW BOOK
    if (book.available) {
      book.available = false;
      await book.save();

      const due = new Date();
      due.setDate(due.getDate() + 7);

      await Borrow.create({
        student: studentId,
        book: book._id,
        dueDate: due,
      });

      return res.json({
        message: `${book.title} borrowed`,
        dueDate: due,
      });
    }

    // RETURN BOOK
    const borrowRecord = await Borrow.findOne({
      book: book._id,
      returned: false,
    });

    if (!borrowRecord) {
      return res.json({ message: "No borrow record found" });
    }

    borrowRecord.returned = true;
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();

    book.available = true;
    await book.save();

    return res.json({ message: `${book.title} returned` });

  } catch (err) {
    res.status(500).json({ error: "Scan failed" });
  }
};