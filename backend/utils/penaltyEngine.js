import { Borrow } from "../models/Borrow.js";
import { User } from "../models/User.js";
import { PenaltyLog } from "../models/PenaltyLog.js";

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
    }).populate("user");

    for (const borrow of activeBorrows) {
      const overdueDays = getOverdueDays(borrow.dueDate);

      if (overdueDays <= 0) continue;

      // 🛡️ SAFETY CHECK: already processed today
      const last = borrow.lastPenaltyDate
        ? new Date(borrow.lastPenaltyDate)
        : null;

      if (last && last >= today) {
        continue; // already processed today
      }

      // 💸 CALCULATE TOTAL FINE (NOT incremental)
      const newFine = overdueDays * FINE_PER_DAY;

      borrow.fine = newFine;
      borrow.status = "overdue";
      borrow.lastPenaltyDate = new Date();

      await borrow.save();

      //LOG PENALTY
    await PenaltyLog.create({
        user: user._id,
        borrow: borrow._id,
        overdueDays,
        fineApplied: newFine,
        reason: "Auto overdue penalty",
    });

      // 👤 USER UPDATE (SAFE SET, NOT ADDITION)
      const user = borrow.user;

      // recompute total fines from all borrows
      const userBorrows = await Borrow.find({ user: user._id });

      const totalFine = userBorrows.reduce(
        (sum, b) => sum + (b.fine || 0),
        0
      );

      user.fineAmount = totalFine;

      // 🚫 AUTO BAN
      if (totalFine >= BAN_THRESHOLD) {
        user.banned = true;
      }

      await user.save();
    }

    console.log("Safe penalty system executed");

  } catch (err) {
    console.error("Penalty system error:", err);
  }
};