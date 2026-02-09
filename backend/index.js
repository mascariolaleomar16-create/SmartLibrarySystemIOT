import dotenv from "dotenv";
import express from "express";
import cors from "cors"

dotenv.config();
const app = express();
const backend_port = process.env.BACKEND_PORT

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(backend_port, () => {
  console.log("Server running on port " + backend_port);
});

export default app;