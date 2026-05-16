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

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isReturned = borrow.returned;

  const isOverdue =
    dueDate && !isReturned && dueDate < today;

  const isDueSoon =
    dueDate &&
    !isReturned &&
    !isOverdue &&
    dueDate >= today &&
    dueDate <= tomorrow;

  return (
    <div className="bg-blue-600 text-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition hover:scale-[1.02] overflow-hidden relative">

      {/* RED ACCENT BAR */}
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>

      {/* BOOK COVER */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg border border-red-300 flex-shrink-0"
      />

      {/* INFO */}
      <div className="flex flex-col justify-between w-full min-w-0">

        <div className="min-w-0">

          <h3 className="font-semibold text-lg text-white truncate">
            {book.title}
          </h3>

          <p className="text-sm text-blue-100 truncate">
            by {book.author}
          </p>

          <p className="text-xs text-blue-200 mt-1 truncate">
            ISBN: {book.isbn || "N/A"}
          </p>

          <p className="text-xs text-red-200 mt-1 font-medium truncate">
            Shelf: {book.shelfNumber || "Unassigned"}
          </p>

        </div>

        <div className="mt-3 space-y-2">

          <div className="flex items-center gap-2 text-xs">
            <FiClock />
            <span>
              Due:{" "}
              {dueDate ? dueDate.toLocaleDateString() : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">

            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium border border-red-300">
              {book.category}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                isReturned
                  ? "bg-blue-200 text-blue-900"
                  : isOverdue
                  ? "bg-red-200 text-red-700"
                  : isDueSoon
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-100 text-blue-900"
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
                <span className="text-blue-100">On Time</span>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}