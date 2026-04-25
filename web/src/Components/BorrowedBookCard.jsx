import React from "react";
import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

export default function BorrowedBookCard({ borrow }) {
  const book = borrow.book || {};

  const today = new Date();
  const dueDate = borrow.dueDate ? new Date(borrow.dueDate) : null;

  /* =========================
     BACKEND-SYNCED LIMITS
     (matches your controller)
  ========================= */
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isReturned = borrow.returned;

  /* =========================
     STATUS LOGIC (SYNCED)
  ========================= */

  const isOverdue =
    dueDate && !isReturned && dueDate < today;

  const isDueSoon =
    dueDate &&
    !isReturned &&
    !isOverdue &&
    dueDate >= today &&
    dueDate <= tomorrow;

  return (
    <div className="bg-[#606c38] text-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition hover:scale-[1.02]">

      {/* BOOK COVER */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg border border-[#a3b18a]"
      />

      {/* INFO */}
      <div className="flex flex-col justify-between w-full">

        <div>
          <h3 className="font-semibold text-lg text-white">
            {book.title}
          </h3>

          <p className="text-sm text-[#e9edc9]">
            by {book.author}
          </p>

          <p className="text-xs text-[#d4d4d4] mt-1">
            ISBN: {book.isbn || "N/A"}
          </p>

          <p className="text-xs text-[#a3b18a] mt-1 font-medium">
            Shelf: {book.shelfNumber || "Unassigned"}
          </p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-3 space-y-2">

          {/* DUE DATE */}
          <div className="flex items-center gap-2 text-xs">
            <FiClock />
            <span>
              Due:{" "}
              {dueDate
                ? dueDate.toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {/* CATEGORY + STATUS */}
          <div className="flex justify-between items-center">

            <span className="text-xs bg-[#a3b18a] text-[#283618] px-2 py-1 rounded-full font-medium">
              {book.category}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                isReturned
                  ? "bg-[#e9edc9] text-[#283618]"
                  : isOverdue
                  ? "bg-red-200 text-red-700"
                  : isDueSoon
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {isReturned
                ? "Returned"
                : isOverdue
                ? "Overdue"
                : isDueSoon
                ? "Due Soon"
                : "On Time"}
            </span>

          </div>

          {/* STATUS ICON ROW */}
          <div className="flex items-center gap-2 text-xs font-semibold">

            {isReturned ? (
              <>
                <FiCheckCircle />
                <span>Returned</span>
              </>
            ) : isOverdue ? (
              <>
                <FiAlertTriangle />
                <span className="text-red-200">Overdue</span>
              </>
            ) : isDueSoon ? (
              <>
                <FiClock />
                <span className="text-yellow-200">Due Soon</span>
              </>
            ) : (
              <>
                <FiCheckCircle />
                <span className="text-[#e9edc9]">On Time</span>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}