import mongoose from "mongoose";

const penaltyLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    borrow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      required: true,
    },

    overdueDays: {
      type: Number,
      required: true,
    },

    fineApplied: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      default: "Overdue book penalty",
    },
  },
  { timestamps: true }
);

export const PenaltyLog = mongoose.model("PenaltyLog", penaltyLogSchema);