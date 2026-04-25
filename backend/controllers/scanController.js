import { Book } from "../models/Book.js";
import { Borrow } from "../models/Borrow.js";
import { startScanning, stopScanning } from "../middleware/rfidScanning.js";

// Note: Ang Na scan na data from the 
// RFID Scanner will be handled by the frontend 
// using sockets.js

export const startScan = (req, res) => {
  startScanning();
  return res.json({
    success: true,
    message: "RFID scanning started"
  });
};

export const stopScan = (req, res) => {
  stopScanning();
  return res.json({
    success: true,
    message: "RFID scanning stopped"
  });
};

export default {
  startScan,
  stopScan
}