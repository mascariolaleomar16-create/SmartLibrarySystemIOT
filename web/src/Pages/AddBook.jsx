import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  FiBook,
  FiUser,
  FiTag,
  FiHash,
  FiFolder,
  FiMapPin,
  FiFileText,
  FiPlusCircle,
  FiPlay,
  FiSquare,
  FiWifi,
  FiImage,
} from "react-icons/fi";

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
  const [message, setMessage] = useState(null);

  // 📡 RFID LISTENER (ONLY WHEN SCANNING)
  useEffect(() => {
    if (!scanning) return;

    const handler = (data) => {
      const cleaned = data?.toString().trim();

      setForm((prev) => ({
        ...prev,
        rfidTag: cleaned,
      }));

      setMessage(`RFID detected: ${cleaned}`);
    };

    socket.on("rfid-scan", handler);

    return () => socket.off("rfid-scan", handler);
  }, [scanning]);

  // 🧠 INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📸 IMAGE HANDLER
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ▶️ START SCAN
  const startScan = async () => {
    await axios.post(`${API_URL}/scan/start`);
    setScanning(true);
    setMessage("Scanner started...");
  };

  // ⏹ STOP SCAN
  const stopScan = async () => {
    await axios.post(`${API_URL}/scan/stop`);
    setScanning(false);
    setMessage("Scanner stopped");
  };

  // 🚀 SUBMIT (RFID SAFE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ BLOCK EMPTY RFID
    if (!form.rfidTag) {
      setMessage("❌ Please scan RFID before adding the book.");
      return;
    }

    if (!form.title || !form.author) {
      setMessage("❌ Title and Author are required.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();

      // ✅ ONLY SEND NON-EMPTY VALUES
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // 📸 IMAGE
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.post(
        `${API_URL}/books/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setMessage(res.data.message);

      // 🔄 RESET FORM
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
      setMessage(err.response?.data?.message || "Error creating book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiPlusCircle /> Add Book
        </h2>
      </div>

      {/* RFID CONTROL */}
      <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiWifi />
          <span className="font-medium">
            RFID: {scanning ? "Active" : "Stopped"}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startScan}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
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
        className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-6"
      >

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-4">

          <input
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            name="author"
            placeholder="Author *"
            value={form.author}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            value={form.rfidTag}
            placeholder="RFID (scan required)"
            className="w-full p-2 border rounded-lg bg-gray-100"
            readOnly
          />

          <input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />

            <input
              name="shelfNumber"
              placeholder="Shelf"
              value={form.shelfNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading || !form.rfidTag}
            className="w-full bg-[#283618] text-white py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Book"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-600">
              {message}
            </p>
          )}

        </div>

        {/* RIGHT SIDE (IMAGE ONLY) */}
        <div className="space-y-3">

          <label className="flex items-center gap-2 text-sm font-medium">
            <FiImage /> Book Cover
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <div className="w-full h-80 border rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">

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