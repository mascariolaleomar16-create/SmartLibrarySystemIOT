import { Borrow } from "../models/Borrow.js";


/* GET ALL BORROWS */
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


/* GET SINGLE BORROW */
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


/* CREATE BORROW */
export const createBorrow = async (req, res) => {
  try {

    const { user, book, dueDate } = req.body;

    if (!user || !book) {
      return res.status(400).json({
        success: false,
        message: "User and Book are required"
      });
    }

    const newBorrow = new Borrow({
      user,
      book,
      dueDate
    });

    await newBorrow.save();

    res.status(201).json({
      success: true,
      message: "Borrow record created",
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


/* UPDATE BORROW */
export const updateBorrow = async (req, res) => {
  try {

    const borrow = await Borrow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Borrow updated successfully",
      borrow
    });

  } catch (error) {

    console.error("Error updating borrow:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update borrow"
    });

  }
};


export default {
  getAllBorrows,
  getBorrow,
  createBorrow,
  updateBorrow
};