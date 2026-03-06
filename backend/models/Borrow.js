import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  book:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Book",
    required:true
  },

  borrowDate:{
    type:Date,
    default:Date.now
  },

  dueDate:{
    type:Date,
    required:true
  },

  returnDate:{
    type:Date,
    default:null
  },

  returned:{
    type:Boolean,
    default:false
  },

  fine:{
    type:Number,
    default:0
  },

  status:{
    type:String,
    enum:["borrowed","returned","overdue"],
    default:"borrowed"
  }

},{timestamps:true});

export const Borrow = mongoose.model("Borrow", borrowSchema);