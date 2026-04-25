import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="bg-[#606c38] text-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition hover:scale-[1.02]">

      {/* Book Cover */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg border border-[#a3b18a]"
      />

      {/* Info */}
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
                Shelf: {book.shelfNumber}
            </p>
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-center mt-3">

          {/* Category */}
          <span className="text-xs bg-[#a3b18a] text-[#283618] px-2 py-1 rounded-full font-medium">
            {book.category}
          </span>

          {/* Availability */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              book.available
                ? "bg-[#e9edc9] text-[#283618]"
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