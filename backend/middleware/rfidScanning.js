import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { getIO } from "./socket.js";
import {Book} from "../models/Book.js";
import {Borrow} from "../models/Borrow.js";



let scanningEnabled = false; // 🔥 CONTROL FLAG

let port;
let parser;

export function startRFIDScanner() {
  port = new SerialPort({
    path: "COM4",
    baudRate: 9600
  });

  parser = port.pipe(
    new ReadlineParser({ delimiter: "\r\n" })
  );

  parser.on("data", (data) => {
    if (!scanningEnabled) return; // 🔥 BLOCK SCAN IF OFF

    if (!data.startsWith("UID:")) return;

    const uid = data.replace("UID:", "").trim();
    console.log("RFID scanned:", uid);

    const io = getIO();
    io.emit("rfid-scan", uid);
  });

  console.log("📡 RFID Scanner initialized (OFF by default)");
}

/* ================= CONTROL FUNCTIONS ================= */

export function startScanning() {
  scanningEnabled = true;
  console.log("🟢 RFID SCANNING STARTED");
}

export function stopScanning() {
  scanningEnabled = false;
  console.log("🔴 RFID SCANNING STOPPED");
}

// 👇 your processing logic hook
async function handleRFID(uid) {
  try {
    const book = await Book.findOne({ rfidTag: uid });

    if (!book) {
      console.log("❌ Book not found for UID:", uid);
      return;
    }

    console.log("📚 Book found:", book.title);

    const activeBorrow = await Borrow.findOne({
      book: book._id,
      returnedAt: null,
    });

    if (activeBorrow) {
      console.log("🔁 Book is currently borrowed → returning flow");
      // return logic here
    } else {
      console.log("📖 Book is available → borrowing flow");
      // borrow logic here
    }
  } catch (err) {
    console.log("❌ RFID Handler Error:", err.message);
  }
}