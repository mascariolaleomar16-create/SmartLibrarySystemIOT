import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by title, author, ISBN, or genre..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#606c38]"
    />
  );
}