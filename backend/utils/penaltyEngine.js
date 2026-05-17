import { Borrow } from "../models/Borrow.js";
import { User } from "../models/User.js";
import { PenaltyLog } from "../models/PenaltyLog.js";
import Notification from "../models/Notification.js";

const FINE_PER_DAY = 10;
const BAN_THRESHOLD = 200;

/* =========================
   CALCULATE OVERDUE DAYS
========================= */
const getOverdueDays = (dueDate) => {
  const now = new Date();
  const diff = now - new Date(dueDate);
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

/* =========================
   SAFE PENALTY RUN
========================= */
export const runPenaltySystem = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBorrows = await Borrow.find({
      returned: false,
    }).populate("user book");

    for (const borrow of activeBorrows) {
      try {
        const user = borrow.user;

        const overdueDays = getOverdueDays(borrow.dueDate);
        if (overdueDays <= 0) continue;

        /* =========================
           SKIP IF ALREADY PROCESSED TODAY
        ========================= */
        const last = borrow.lastPenaltyDate
          ? new Date(borrow.lastPenaltyDate)
          : null;

        if (last && last >= today) continue;

        /* =========================
           CALCULATE FINE (TOTAL)
        ========================= */
        const newFine = overdueDays * FINE_PER_DAY;

        borrow.fine = newFine;
        borrow.status = "overdue";
        borrow.lastPenaltyDate = new Date();

        await borrow.save();

        /* =========================
           PENALTY LOG (FIXED)
        ========================= */
        await PenaltyLog.create({
          user: user._id,
          borrow: borrow._id,
          overdueDays,
          fineApplied: newFine,
          reason: "Auto overdue penalty",
        });

        /* =========================
           USER TOTAL FINE RECALC
        ========================= */
        const userBorrows = await Borrow.find({ user: user._id });

        const totalFine = userBorrows.reduce(
          (sum, b) => sum + (b.fine || 0),
          0
        );

        user.fineAmount = totalFine;

        /* =========================
           AUTO BAN CHECK
        ========================= */
        if (totalFine >= BAN_THRESHOLD) {
          user.banned = true;

          await Notification.create({
            userId: user._id,
            title: "Account Banned",
            message: "You have been banned due to excessive penalties.",
            type: "ban",
          });
        }

        await user.save();

        /* =========================
           PENALTY NOTIFICATION
        ========================= */
        await Notification.create({
          userId: user._id,
          title: "Overdue Penalty Applied",
          message: `You have been charged ₱${newFine} for overdue book: "${borrow.book.title}".`,
          type: "penalty",
        });

      } catch (innerErr) {
        console.error("Borrow penalty error:", innerErr);
      }
    }

    console.log("Penalty system executed successfully");

  } catch (err) {
    console.error("Penalty system error:", err);
  }
};