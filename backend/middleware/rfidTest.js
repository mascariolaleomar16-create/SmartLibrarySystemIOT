import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { io } from "../server.js";

//run using npm  middleware\rfidTest.js
//this is for debugging only

const port = new SerialPort({
    path: "COM4",
    baudRate: 9600
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  parser.on("data", async (data) => {

    if (!data.startsWith("UID:")) return;

    const uid = data.replace("UID:", "").trim();
    console.log("RFID scanned:", uid);

    // 🔥 SEND TO FRONTEND
    io.emit("rfid-scan", uid);

    //await handleRFID(uid);
  });