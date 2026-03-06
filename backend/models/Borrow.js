import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  user:{ type:mongoose.Schema.Types.ObjectId, ref:"User" },
  book:{ type:mongoose.Schema.Types.ObjectId, ref:"Book" },
  borrowDate:{ type:Date, default:Date.now },
  dueDate:Date,
  returned:{ type:Boolean, default:false },
  returnDate:Date
});

export default mongoose.model("Borrow", borrowSchema);
