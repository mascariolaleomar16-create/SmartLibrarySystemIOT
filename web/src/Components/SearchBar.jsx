import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by title, author, ISBN, or genre..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-red-400 transition"
    />
  );
}