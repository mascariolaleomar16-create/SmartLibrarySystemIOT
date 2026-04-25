import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex gap-4 hover:shadow-md transition">
      
      {/* Book Cover */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg"
      />

      {/* Info */}
      <div className="flex flex-col justify-between w-full">
        <div>
          <h3 className="font-semibold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-xs text-gray-500 mt-1">
            ISBN: {book.isbn || "N/A"}
          </p>
        </div>

        {/* Category instead of genre */}
        <div className="flex justify-between items-center mt-3">

          <span className="text-xs bg-[#dde5b6] text-[#283618] px-2 py-1 rounded-full">
            {book.category}
          </span>

          {/* Availability */}
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              book.available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {book.available ? "Available" : "Borrowed"}
          </span>

        </div>
      </div>
    </div>
  );
}