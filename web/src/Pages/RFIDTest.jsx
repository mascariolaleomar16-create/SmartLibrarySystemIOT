import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5050");

export default function RFIDTest() {
  const [scanning, setScanning] = useState(false);
  const [uid, setUid] = useState(null);
  const [book, setBook] = useState(null);

  useEffect(() => {
    socket.on("rfid-scan", (data) => {
      setUid(data);

      // placeholder book info (replace later with backend data)
      setBook({
        title: "Sample Book Title",
        author: "John Doe",
        image: "https://via.placeholder.com/120x160?text=Book",
        status: "Available"
      });
    });

    return () => socket.off("rfid-scan");
  }, []);

  const startScan = async () => {
    await axios.post("http://localhost:5050/api/scan/start");
    setScanning(true);
    setUid(null);
    setBook(null);
  };

  const stopScan = async () => {
    await axios.post("http://localhost:5050/api/scan/stop");
    setScanning(false);
  };

  return (
    <div style={styles.container}>
      {/* STATUS BADGE */}
      <div style={styles.statusBadge(scanning)}>
        {scanning ? "🟢 Scan Started" : "🔴 Scan Stopped"}
      </div>

      <h2 style={{ marginBottom: 20 }}>RFID Scanner</h2>

      {/* BUTTONS */}
      <div style={styles.buttonRow}>
        <button
          onClick={startScan}
          style={{ ...styles.button, background: "#16a34a" }}
        >
          Start Scan
        </button>

        <button
          onClick={stopScan}
          style={{ ...styles.button, background: "#dc2626" }}
        >
          Stop Scan
        </button>
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        {!scanning ? (
          <p style={{ color: "#666" }}>Please start the scan</p>
        ) : uid ? (
          <>
            <h3>Scanned Book</h3>

            <img
              src={book.image}
              alt="book"
              style={{ width: 120, height: 160, borderRadius: 8 }}
            />

            <p><b>UID:</b> {uid}</p>
            <p><b>Title:</b> {book.title}</p>
            <p><b>Author:</b> {book.author}</p>
            <p><b>Status:</b> {book.status}</p>
          </>
        ) : (
          <p style={{ color: "#666" }}>Waiting for RFID scan...</p>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    position: "relative"
  },

  statusBadge: (scanning) => ({
    position: "absolute",
    top: 10,
    right: 10,
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    color: "white",
    background: scanning ? "#16a34a" : "#dc2626"
  }),

  buttonRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },

  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
  },

  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    border: "1px solid #ddd",
    width: 300,
    background: "#fafafa"
  }
};