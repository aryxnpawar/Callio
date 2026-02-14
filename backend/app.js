import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import meetingRoutes from "./src/routes/meetingRoutes.js";
import cookieParser from "cookie-parser";
import { initSocketServer } from "./src/controllers/socketManager.js";
import { createServer } from "node:http";

dotenv.config();

const app = express();
const server = createServer(app);

initSocketServer(server);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.APP_PORT || 3000;
const dbURl = process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("Error Occured : ", err);
  });

async function main() {
  await mongoose.connect(dbURl,);
}

app.use("/api/auth", authRoutes);
app.use("/meeting", meetingRoutes);

server.listen(PORT, () => {
  console.log("Listening on PORT : ", PORT);
});

app.get("/health", (req, res) => {
  res.send("all good");
});
