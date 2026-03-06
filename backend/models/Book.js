import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title:String,
  author:String,
  isbn:String,
  description:String,
  rfidTag:String,
  available:{ type:Boolean, default:true }
});

export const Book = mongoose.model("Book", bookSchema);
