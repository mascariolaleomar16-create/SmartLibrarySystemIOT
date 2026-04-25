import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import {
  FiPlay,
  FiSquare,
  FiBookOpen,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
} from "react-icons/fi";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const API_URL = process.env.REACT_APP_API_URL;

export default function RFIDScan() {
  const [scanning, setScanning] = useState(false);
  const [uid, setUid] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("rfid-scan", async (data) => {
      const cleanedRFID = data?.toString().trim(); // 🔥 FIX

      setUid(cleanedRFID);
      setLoading(true);
      setBook(null);

      try {
        const res = await axios.get(
          `${API_URL}/books/getByRFID/${cleanedRFID}`
        );

        if (res.data.success) {
          setBook(res.data.book);
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    });

    return () => socket.off("rfid-scan");
  }, []);

  const startScan = async () => {
    await axios.post(`${API_URL}/scan/start`);
    setScanning(true);
    setUid(null);
    setBook(null);
  };

  const stopScan = async () => {
    await axios.post(`${API_URL}/scan/stop`);
    setScanning(false);
  };

  const isAvailable = book?.available === true;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FiBookOpen /> RFID Scanner
        </h2>
        <p className="text-[#606c38] font-medium">
          Scan a book using RFID to view details
        </p>
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div
          className={`px-4 py-1 rounded-full text-xs font-semibold text-white shadow flex items-center gap-2 w-fit ${
            scanning ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {scanning ? <FiCheckCircle /> : <FiXCircle />}
          {scanning ? "Scanning Active" : "Scanner Stopped"}
        </div>

        <div className="flex gap-4">
          <button
            onClick={startScan}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 transition"
          >
            <FiPlay />
            Start
          </button>

          <button
            onClick={stopScan}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-xl font-semibold shadow hover:bg-red-600 transition"
          >
            <FiSquare />
            Stop
          </button>
        </div>
      </div>

      {/* RESULT */}
      <div className="bg-white p-6 rounded-2xl shadow">

        {!scanning ? (
          <p className="text-center text-gray-500">
            Click Start to begin scanning
          </p>

        ) : loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Fetching book data...
          </p>

        ) : uid ? (
          book ? (
            <div className="flex flex-col items-center text-center">

              {/* IMAGE */}
              {book.image?.url && (
                <img
                  src={book.image.url}
                  alt="book"
                  className="w-[210px] h-[300px] object-cover rounded-xl shadow-md mb-4"
                />
              )}

              {/* TITLE */}
              <h3 className="text-lg font-bold text-gray-800">
                {book.title}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                {book.author}
              </p>

              {/* RFID */}
              <p className="text-xs text-gray-400 mb-2">
                RFID: {uid}
              </p>

              {/* CATEGORY + SHELF */}
              <div className="flex gap-2 mb-3 flex-wrap justify-center">

                <span className="text-xs bg-[#606c38] text-white px-3 py-1 rounded-full">
                  {book.category}
                </span>

                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <FiMapPin />
                  Shelf: {book.shelfNumber}
                </span>

              </div>

              {/* AVAILABILITY */}
              <span
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isAvailable ? <FiCheckCircle /> : <FiXCircle />}
                {isAvailable ? "Available" : "Borrowed"}
              </span>

              {/* DESCRIPTION */}
              {book.description && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-5 rounded-lg border text-justify leading-relaxed">
                  {book.description}
                </div>
              )}
            </div>

          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                RFID: {uid}
              </p>
              <p className="text-red-500 font-semibold flex items-center justify-center gap-1">
                <FiXCircle /> Book not found
              </p>
            </div>
          )

        ) : (
          <p className="text-center text-gray-500">
            Waiting for RFID scan...
          </p>
        )}

      </div>
    </div>
  );
}