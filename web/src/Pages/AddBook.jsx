import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FiPlusCircle,
  FiPlay,
  FiSquare,
  FiWifi,
  FiImage,
} from "react-icons/fi";

import { showSuccess, showError, showWarning } from "../utils/toast";

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(process.env.REACT_APP_SOCKET_URL);

export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    category: "General",
    shelfNumber: "",
    rfidTag: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scanning) return;

    const handler = (data) => {
      const cleaned = data?.toString().trim();

      setForm((prev) => ({
        ...prev,
        rfidTag: cleaned,
      }));

      showSuccess(`RFID detected: ${cleaned}`);
    };

    socket.on("rfid-scan", handler);

    return () => socket.off("rfid-scan", handler);
  }, [scanning]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const startScan = async () => {
    try {
      await axios.post(`${API_URL}/scan/start`);
      setScanning(true);
      showSuccess("Scanner started");
    } catch {
      showError("Failed to start scanner");
    }
  };

  const stopScan = async () => {
    try {
      await axios.post(`${API_URL}/scan/stop`);
      setScanning(false);
      showWarning("Scanner stopped");
    } catch {
      showError("Failed to stop scanner");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.rfidTag) {
      return showWarning("Please scan RFID before adding the book.");
    }

    if (!form.title || !form.author) {
      return showWarning("Title and Author are required.");
    }

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.post(
        `${API_URL}/books/create`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      showSuccess(res.data.message || "Book added successfully");

      setForm({
        title: "",
        author: "",
        isbn: "",
        description: "",
        category: "General",
        shelfNumber: "",
        rfidTag: "",
      });

      setImageFile(null);
      setPreview(null);
    } catch (err) {
      showError(err.response?.data?.message || "Error creating book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-blue-600 text-white p-5 rounded-2xl shadow relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiPlusCircle /> Add Book
        </h2>
      </div>

      {/* RFID CONTROL */}
      <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center border border-blue-100">

        <div className="flex items-center gap-2 text-blue-700">
          <FiWifi />
          <span className="font-medium">
            RFID: {scanning ? "Active" : "Stopped"}
          </span>
        </div>

        <div className="flex gap-3">

          <button
            onClick={startScan}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiPlay /> Start
          </button>

          <button
            onClick={stopScan}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
          >
            <FiSquare /> Stop
          </button>

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-6 border border-blue-100"
      >

        {/* LEFT */}
        <div className="md:col-span-2 space-y-4">

          <input
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="author"
            placeholder="Author *"
            value={form.author}
            onChange={handleChange}
            className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            value={form.rfidTag}
            placeholder="RFID (scan required)"
            className="w-full p-2 border border-red-200 rounded-lg bg-gray-100"
            readOnly
          />

          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            className="w-full p-2 border border-blue-200 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-lg"
            />

            <input
              name="shelfNumber"
              placeholder="Shelf"
              value={form.shelfNumber}
              onChange={handleChange}
              className="w-full p-2 border border-blue-200 rounded-lg"
            />

          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border border-blue-200 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading || !form.rfidTag}
            className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Add Book"}
          </button>

        </div>

        {/* RIGHT */}
        <div className="space-y-3">

          <label className="flex items-center gap-2 text-sm font-medium text-blue-700">
            <FiImage /> Book Cover
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <div className="w-full h-80 border border-blue-100 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">

            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-400 text-sm">
                Image preview
              </p>
            )}

          </div>

        </div>

      </form>
    </div>
  );
}