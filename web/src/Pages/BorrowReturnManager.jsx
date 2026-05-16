import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { FiPlay, FiSquare, FiMapPin } from "react-icons/fi";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const API_URL = process.env.REACT_APP_API_URL;

export default function BorrowReturnManager() {
  const [mode, setMode] = useState("borrow");
  const [scanning, setScanning] = useState(false);

  const [rfid, setRfid] = useState("");
  const [book, setBook] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/users/`)
      .then(res => {
        const activeUsers = res.data.filter(
          (u) => u.banned === false || u.banned === "false" || u.banned === 0
        );
        setUsers(activeUsers);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!scanning) return;

    const handler = async (data) => {
      const cleaned = data?.toString().trim();

      setRfid(cleaned);
      setBook(null);

      try {
        const res = await axios.get(
          `${API_URL}/books/getByRFID/${cleaned}`
        );

        setBook(res.data.book);
      } catch (err) {
        console.error(err);
        setBook(null);
      }
    };

    socket.on("rfid-scan", handler);
    return () => socket.off("rfid-scan", handler);
  }, [scanning]);

  const startScan = async () => {
    await axios.post(`${API_URL}/scan/start`);
    setScanning(true);
    setRfid("");
    setBook(null);
  };

  const stopScan = async () => {
    await axios.post(`${API_URL}/scan/stop`);
    setScanning(false);
  };

  const handleBorrow = async () => {
    if (!book?._id) return alert("No book selected");
    if (!selectedUser) return alert("Please select a user");

    try {
      await axios.post(`${API_URL}/borrow/`, {
        user: selectedUser,
        book: book._id,
      });

      alert("Book borrowed successfully");

      setBook(null);
      setRfid("");
      setSelectedUser("");
    } catch (err) {
      alert(err.response?.data?.message || "Borrow failed");
    }
  };

  const handleReturn = async () => {
    if (!book?._id) return alert("No book scanned");

    try {
      const res = await axios.put(
        `${API_URL}/borrow/return-by-book/${book._id}`
      );

      alert(
        `Book returned successfully${
          res.data.fine ? ` | Fine: ₱${res.data.fine}` : ""
        }`
      );

      setBook(null);
      setRfid("");
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex gap-3">
        <button
          onClick={() => setMode("borrow")}
          className={`px-4 py-2 rounded ${
            mode === "borrow"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          Borrow
        </button>

        <button
          onClick={() => setMode("return")}
          className={`px-4 py-2 rounded ${
            mode === "return"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-700"
          }`}
        >
          Return
        </button>
      </div>

      <div className="flex justify-between bg-white p-4 rounded-xl shadow border border-blue-100">
        <span className={scanning ? "text-blue-600" : "text-red-500"}>
          Scanner: {scanning ? "Active" : "Stopped"}
        </span>

        <div className="flex gap-2">
          <button
            onClick={startScan}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            <FiPlay />
          </button>

          <button
            onClick={stopScan}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            <FiSquare />
          </button>
        </div>
      </div>

      {book && (
        <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-3 gap-4 border border-blue-100">

          <div className="flex justify-center">
            <img
              src={book.image?.url || "/default-book.jpg"}
              className="w-[160px] h-[240px] object-cover rounded-lg shadow"
              alt={book.title}
            />
          </div>

          <div className="md:col-span-2 space-y-1">

            <h2 className="text-xl font-bold text-blue-700">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>

            <p className="text-xs text-gray-400">RFID: {rfid}</p>

            <div className="flex gap-2 flex-wrap mt-2">

              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                {book.category}
              </span>

              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <FiMapPin />
                {book.shelfNumber}
              </span>

              <span className={`text-xs px-3 py-1 rounded-full ${
                book.available
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-600"
              }`}>
                {book.available ? "Available" : "Borrowed"}
              </span>

            </div>

          </div>
        </div>
      )}

      {mode === "borrow" && book && (
        <div className="bg-white p-4 rounded-xl shadow space-y-3 border border-blue-100">

          {!book.available && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
              ⚠️ This book is currently unavailable.
            </div>
          )}

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border border-blue-200 p-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>

          <button
            onClick={handleBorrow}
            disabled={!book.available || !selectedUser}
            className={`w-full py-2 rounded text-white ${
              !book.available || !selectedUser
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Borrow Book
          </button>

        </div>
      )}

      {mode === "return" && book && (
        <div className="bg-white p-4 rounded-xl shadow space-y-3 border border-red-100">

          {book.available && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
              ⚠️ This book is not currently borrowed.
            </div>
          )}

          <button
            onClick={handleReturn}
            disabled={book.available}
            className={`w-full py-2 rounded text-white ${
              book.available
                ? "bg-gray-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Return Book
          </button>

        </div>
      )}

    </div>
  );
}