import { SerialPort } from "serialport";
//run using npm  middleware\arduinoSerialFinder.js
const ports = await SerialPort.list();

console.log("🔍 AVAILABLE SERIAL PORTS:");

ports.forEach(p => {
  console.log("PATH:", p.path);
  console.log("MANUFACTURER:", p.manufacturer);
  console.log("----------------------");
});