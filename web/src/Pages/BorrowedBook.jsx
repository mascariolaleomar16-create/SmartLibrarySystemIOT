import React, { useEffect, useState } from "react";
import axios from "axios";
import BorrowedBookCard from "../Components/BorrowedBookCard.jsx";

import {
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiBookOpen,
} from "react-icons/fi";

export default function BorrowedBook() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Get user
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });

        const userData = userRes.data.user;
        setUser(userData);

        // 2. Get borrows
        const borrowRes = await axios.get(
          `${API_URL}/borrow/user/${userData._id}`,
          { withCredentials: true }
        );

        const borrowData = borrowRes.data.borrows;

        // 3. FETCH BOOK DETAILS PER BORROW
        const enriched = await Promise.all(
          borrowData.map(async (b) => {

            const bookId = b.book?._id || b.book;

            try {
              const bookRes = await axios.get(
                `${API_URL}/books/getById/${bookId}`
              );

              return {
                ...b,
                book: bookRes.data.book,
              };

            } catch (err) {
              console.error("Error fetching book:", err);

              return {
                ...b,
                book: null,
              };
            }
          })
        );

        setBorrows(enriched);

      } catch (error) {
        console.error("Error loading borrowed books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isOverdue = (dueDate) => {
    return dueDate && new Date(dueDate) < new Date();
  };

  const renderStatus = (borrow) => {
    if (borrow.returned) {
      return (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <FiCheckCircle />
          Returned
        </span>
      );
    }

    if (isOverdue(borrow.dueDate)) {
      return (
        <span className="flex items-center gap-1 text-xs text-red-600">
          <FiAlertTriangle />
          Overdue
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-xs text-green-600">
        <FiClock />
        On Time
      </span>
    );
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
          <div className="grid grid-cols-3 gap-4">

            {borrows.map((borrow) => (
              <div key={borrow._id} className="space-y-2">

                {/* SAFE BOOK CARD */}
                {borrows.map((borrow) => (
                  <BorrowedBookCard key={borrow._id} borrow={borrow} />
                ))}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}