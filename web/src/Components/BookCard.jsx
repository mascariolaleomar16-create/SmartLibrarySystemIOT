import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="bg-blue-600 text-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition hover:scale-[1.02] overflow-hidden relative">

      {/* RED ACCENT BAR */}
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>

      {/* Book Cover */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg border border-red-300 flex-shrink-0"
      />

      {/* Info */}
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
            Shelf: {book.shelfNumber}
          </p>

        </div>

        <div className="flex justify-between items-center mt-3">

          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium border border-red-300">
            {book.category}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              book.available
                ? "bg-blue-200 text-blue-900"
                : "bg-red-200 text-red-700"
            }`}
          >
            {book.available ? "Available" : "Borrowed"}
          </span>

        </div>

      </div>
    </div>
  );
}