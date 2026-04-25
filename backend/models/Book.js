import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },

    description: {
      type: String,
    },

    rfidTag: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      default: "General",
    },

    available: {
      type: Boolean,
      default: true,
    },
    shelfNumber: {
      type: String,
      default: "Unassigned",
    },
    image: {
        url: { 
          type: String,
          default: "/images/default-book.jpg",
        },
        public_id: { 
          type: String,
          default: null,
        }
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);