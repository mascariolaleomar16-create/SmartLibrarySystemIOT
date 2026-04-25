import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../Components/BookCard";
import SearchBar from "../Components/SearchBar";

export default function LibraryCatalogue() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books/getAll`);
        setBooks(res.data.books);
        setFilteredBooks(res.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);


  // Search filter
  useEffect(() => {
    const searchLower = search.toLowerCase();

    const filtered = books.filter((book) => {
      return (
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.isbn?.toLowerCase().includes(searchLower) ||
        book.category?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredBooks(filtered);
    setCurrentPage(1); // ✅ reset page when searching
  }, [search, books]);

  // ✅ Pagination logic
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-4">

      <h2 className="text-lg font-semibold">Search Library</h2>

      <p className="text-[#606c38] font-medium">
        Search for books in the library by title, author, or ISBN
      </p>

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Book List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))
        ) : (
          <p className="text-gray-500">No books found.</p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">

          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}