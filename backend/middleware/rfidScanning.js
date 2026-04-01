import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";

export function startRFIDScanner() {

  const port = new SerialPort({
    path: "COM3",
    baudRate: 9600
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", async (data) => {

    if (!data.startsWith("UID:")) return;

    const uid = data.replace("UID:", "").trim();
    console.log("RFID scanned:", uid);

    await handleRFID(uid);
  });

}

async function handleRFID(uid) {

  const book = await Book.findOne({ rfidTag: uid });

  if (!book) {
    console.log("Book not found");
    return;
  }

  if (book.available) {
    console.log("Borrowing book");

    book.available = false;
    await book.save();
  } 
  else {
    console.log("Returning book");

    book.available = true;
    await book.save();
  }
}