import React, { useEffect, useState } from "react";
import axios from "axios";
import BorrowedBookCard from "../Components/BorrowedBookCard.jsx";
import {
  FiBookOpen,
} from "react-icons/fi";

export default function BorrowedBook() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  //PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userRes = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });

        const userData = userRes.data.user;
        setUser(userData);

        const borrowRes = await axios.get(
          `${API_URL}/borrow/user/${userData._id}`,
          { withCredentials: true }
        );

        const borrowData = borrowRes.data.borrows;

        const uniqueBorrows = Array.from(
          new Map(borrowData.map((b) => [b._id, b])).values()
        );

        const enriched = await Promise.all(
          uniqueBorrows.map(async (b) => {
            const bookId = b.book?._id || b.book;

            try {
              const bookRes = await axios.get(
                `${API_URL}/books/getById/${bookId}`
              );

              return { ...b, book: bookRes.data.book };
            } catch {
              return { ...b, book: null };
            }
          })
        );

        setBorrows(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  //pagination calculations
  const totalPages = Math.ceil(borrows.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = borrows.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const goPrev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiBookOpen />
          Borrowed Books
        </h2>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-5 rounded-2xl shadow">

        {loading ? (
          <p className="text-center text-gray-500">
            Loading borrowed books...
          </p>
        ) : !user ? (
          <p className="text-center text-red-500">
            Not authenticated
          </p>
        ) : borrows.length === 0 ? (
          <p className="text-center text-gray-500">
            No borrowed books found.
          </p>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-3 gap-4">
              {currentItems.map((borrow) => (
                <BorrowedBookCard
                  key={borrow._id}
                  borrow={borrow}
                />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={goNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}