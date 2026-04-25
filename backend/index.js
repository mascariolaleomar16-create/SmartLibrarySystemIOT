import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import monitorRoutes from "./routes/monitorRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import { startRFIDScanner } from "./middleware/rfidScanning.js";
import cookieParser from "cookie-parser";

import http from "http";
import { initSocket } from "./middleware/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const backend_port = process.env.BACKEND_PORT || 5000;

/* ================= SOCKET.IO ================= */
initSocket(server);

/* ================= MIDDLEWARE ================= */
app.use(cookieParser());
app.use(cors({
  origin: process.env.WEB_URL, // your React app
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/monitor", monitorRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/borrow", borrowRoutes);

/* ================= ERROR HANDLING ================= */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

/* ================= SERVER START ================= */
server.listen(backend_port, async () => {
  await connectDB(mongoose);
  startRFIDScanner();
  console.log(`Server running on http://localhost:${backend_port}`);
});

/* ================= EXPORT SOCKET ================= */
export default app;