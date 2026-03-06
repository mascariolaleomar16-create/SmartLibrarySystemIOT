import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import connectDB from "./config/db.js"
import monitorRoutes from "./routes/monitorRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

dotenv.config();
const app = express();
const backend_port = process.env.BACKEND_PORT || 5000;

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
});

app.use(cors());
app.use(express.json());

app.use("/api/monitor", monitorRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/borrow", borrowRoutes);

app.listen(backend_port, () => {
  connectDB(mongoose);
  console.log("Server running on port  http://localhost:" + backend_port);
});

export default app;
