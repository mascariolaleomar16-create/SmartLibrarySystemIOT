import {User} from "../models/User.js";
import {Book} from "../models/Book.js";
import Borrow from "../models/Borrow.js";

let activeStudent = null;

export const handleScan = async (req, res) => {
  try {
    const { username } = req.body;

    const student = await User.findOne({ username: username });
    const book = await Book.findOne({ rfidTag: rfid });

    if (student) {
      activeStudent = student;
      return res.json({
        message: `Admin scanned student: ${student.name}`,
        fine: student.fineAmount,
      });
    }

    if (book && activeStudent) {
      if (book.available) {
        book.available = false;
        await book.save();

        const due = new Date();
        due.setDate(due.getDate() + 7);

        await Borrow.create({
          student: activeStudent._id,
          book: book._id,
          dueDate: due,
        });

        return res.json({
          message: `${activeStudent.name} borrowed ${book.title}`,
          dueDate: due,
        });
      } else {
        book.available = true;
        await book.save();

        const borrowRecord = await Borrow.findOne({
          book: book._id,
          returned: false,
        });

        if (!borrowRecord) {
          return res.json({ message: "No active borrow record found" });
        }

        borrowRecord.returned = true;
        borrowRecord.returnDate = new Date();
        await borrowRecord.save();

        const today = new Date();
        if (today > borrowRecord.dueDate) {
          const daysLate = Math.ceil(
            (today - borrowRecord.dueDate) / (1000 * 60 * 60 * 24)
          );

          const fine = daysLate * 10;

          activeStudent.fineAmount += fine;
          await activeStudent.save();

          return res.json({
            message: `Returned late. Fine: ₱${fine}`,
            totalFine: activeStudent.fineAmount,
          });
        }

        return res.json({ message: `${book.title} returned successfully` });
      }
    }

    return res.json({ message: "RFID not recognized" });
  } catch (err) {
    return res.status(500).json({ error: "Scan error" });
  }
};

export default {
  handleScan,
};
