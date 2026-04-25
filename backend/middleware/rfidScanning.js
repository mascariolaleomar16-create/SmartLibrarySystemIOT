import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { getIO } from "./socket.js";
import { Book } from "../models/Book.js";
import { Borrow } from "../models/Borrow.js";

/* ================= STATE ================= */

let scanningEnabled = false;

let port = null;
let parser = null;

let reconnectTimer = null;
let isConnecting = false;

// 🔥 FIX: prevents reconnect chaos after nodemon restart
let booting = true;

/* ================= FIND PORT ================= */

async function findArduinoPort() {
  try {
    const ports = await SerialPort.list();

    console.log("🔍 Detected serial ports:");
    ports.forEach(p => console.log(p.path, p.manufacturer, p.productId));

    const match = ports.find(p =>
      (p.manufacturer && p.manufacturer.toLowerCase().includes("wch")) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes("ch340")) ||
      (p.path && p.path.includes("COM"))
    );

    return match?.path || null;

  } catch (err) {
    console.log("❌ Port scan failed:", err.message);
    return null;
  }
}

/* ================= SAFE OPEN ================= */

function safeOpen(portInstance, retries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      portInstance.open((err) => {
        if (!err) return resolve();

        console.log(`❌ Open failed (retry ${4 - n}/3):`, err.message);

        if (n <= 0) return reject(err);

        setTimeout(() => attempt(n - 1), 2000);
      });
    };

    attempt(retries);
  });
}

/* ================= CONNECT RFID ================= */

async function connectRFID() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    const path = await findArduinoPort();

    if (!path) {
      console.log("⚠️ No device found");
      scheduleReconnect();
      return;
    }

    console.log("🔌 Connecting RFID on:", path);

    // 🔥 IMPORTANT: CH340 + nodemon restart safety delay
    await new Promise(res => setTimeout(res, 3000));

    // 🔥 FIX: prevent zombie port during restart window
    if (booting && port?.isOpen) {
      try {
        await new Promise(resolve => port.close(resolve));
      } catch {}
      port = null;
    }

    // 🔥 CLEAN OLD PORT SAFELY
    if (port) {
      try {
        if (port.isOpen) {
          await new Promise(resolve => port.close(resolve));
        }
      } catch (e) {
        console.log("⚠️ Cleanup ignored:", e.message);
      }

      port = null;
      await new Promise(res => setTimeout(res, 2000));
    }

    // ================= CREATE PORT =================

    port = new SerialPort({
      path,
      baudRate: 9600,
      autoOpen: false,
    });

    await safeOpen(port);

    console.log("🔧 Resetting CH340 DTR...");

    try {
      port.set({ dtr: false }, () => {
        setTimeout(() => {
          port.set({ dtr: true });
        }, 300);
      });
    } catch (e) {
      console.log("⚠️ DTR reset skipped");
    }

    console.log("✅ RFID connected");

    // ================= PARSER =================

    parser = port.pipe(
      new ReadlineParser({ delimiter: "\r\n" })
    );

    parser.on("data", (data) => {
      if (!scanningEnabled) return;
      if (!data.startsWith("UID:")) return;

      const uid = data.replace("UID:", "").trim();
      console.log("📡 RFID scanned:", uid);

      const io = getIO();
      io.emit("rfid-scan", uid);

      handleRFID(uid);
    });

    // ================= EVENTS =================

    port.on("close", () => {
      console.log("⚠️ Port closed");
      port = null;
      scheduleReconnect();
    });

    port.on("error", (err) => {
      console.log("❌ Serial error:", err.message);
      port = null;
      scheduleReconnect();
    });

  } catch (err) {
    console.log("❌ Connect error:", err.message);
    port = null;
    scheduleReconnect();
  } finally {
    setTimeout(() => {
      isConnecting = false;
    }, 0);
  }
}

/* ================= RECONNECT ================= */

function scheduleReconnect() {
  if (reconnectTimer) return;
  if (booting) return; // 🔥 IMPORTANT FIX

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectRFID();
  }, 5000);
}

/* ================= PUBLIC API ================= */

export function startRFIDScanner() {
  console.log("📡 RFID Scanner initializing...");

  booting = true;

  setTimeout(() => {
    booting = false;
    connectRFID();
  }, 3000); // 🔥 nodemon-safe startup delay
}

export function startScanning() {
  scanningEnabled = true;
  console.log("🟢 RFID SCANNING STARTED");
}

export function stopScanning() {
  scanningEnabled = false;
  console.log("🔴 RFID SCANNING STOPPED");
}

/* ================= OPTIONAL HANDLER ================= */

async function handleRFID(uid) {
  try {
    const book = await Book.findOne({ rfidTag: uid });

    if (!book) {
      console.log("❌ Book not found:", uid);
      return;
    }

    console.log("📚 Book:", book.title);

    const activeBorrow = await Borrow.findOne({
      book: book._id,
      returnedAt: null,
    });

    if (activeBorrow) {
      console.log("🔁 Returning flow");
    } else {
      console.log("📖 Borrowing flow");
    }

  } catch (err) {
    console.log("❌ RFID handler error:", err.message);
  }
}