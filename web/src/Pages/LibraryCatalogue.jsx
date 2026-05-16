import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../Components/BookCard";
import SearchBar from "../Components/SearchBar";

export default function LibraryCatalogue() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

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
    setCurrentPage(1);
  }, [search, books]);

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 space-y-5">

      {/* HEADER */}
      <div className="border-l-4 border-red-500 pl-3">
        <h2 className="text-xl font-bold text-blue-600">
          Library Catalogue
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Search for books by title, author, ISBN, or category
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* RESULTS INFO */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Total Results:{" "}
          <span className="text-blue-600 font-semibold">
            {filteredBooks.length}
          </span>
        </span>

        <span>
          Page{" "}
          <span className="text-red-500 font-semibold">
            {currentPage}
          </span>{" "}
          of {totalPages}
        </span>
      </div>

      {/* BOOK LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            <span className="text-red-500 font-semibold">
              No books found
            </span>
          </div>
        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">

          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-40 hover:bg-blue-200 transition"
          >
            Prev
          </button>

          <div className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-sm">
            Page {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold disabled:opacity-40 hover:bg-red-200 transition"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}