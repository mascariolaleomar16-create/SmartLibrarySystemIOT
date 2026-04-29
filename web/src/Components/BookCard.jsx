import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="bg-[#606c38] text-white rounded-2xl shadow-md p-4 flex gap-4 hover:shadow-lg transition hover:scale-[1.02] overflow-hidden">

      {/* Book Cover */}
      <img
        src={book.image?.url || "/default-book.jpg"}
        alt={book.title}
        className="w-20 h-28 object-cover rounded-lg border border-[#a3b18a] flex-shrink-0"
      />

      {/* Info */}
      <div className="flex flex-col justify-between w-full min-w-0">

        <div className="min-w-0">

          {/* TITLE BOX */}
          <div className="relative w-full overflow-hidden group">

            {/* STATIC TRUNCATED TITLE */}
            <h3 className="font-semibold text-lg text-white truncate group-hover:opacity-0 transition-opacity duration-150">
              {book.title}
            </h3>

            {/* HOVER PING-PONG MARQUEE */}
            <div className="absolute top-0 left-0 w-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <div className="whitespace-nowrap animate-marquee-pingpong text-lg font-semibold text-white">
                {book.title}
              </div>
            </div>

          </div>

          <p className="text-sm text-[#e9edc9] truncate">
            by {book.author}
          </p>

          <p className="text-xs text-[#d4d4d4] mt-1 truncate">
            ISBN: {book.isbn || "N/A"}
          </p>

          <p className="text-xs text-[#a3b18a] mt-1 font-medium truncate">
            Shelf: {book.shelfNumber}
          </p>

        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center mt-3">

          <span className="text-xs bg-[#a3b18a] text-[#283618] px-2 py-1 rounded-full font-medium">
            {book.category}
          </span>

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