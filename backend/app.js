import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import {initSocketServer} from "./src/controllers/socketManager.js";
import { createServer } from "node:http";

dotenv.config();

const app = express();
const server = createServer(app);

const io = initSocketServer(server);

io.on("connection", (socket) => {
  console.log("a user connected with id : ", socket.id);
  socket.emit("welcome", "Welcome to the Socket.IO server");
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(urlencoded({ extended: true }));
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
  await mongoose.connect(dbURl);
}

server.listen(PORT, () => {
  console.log("Listening on PORT : ", PORT);
});

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("all good");
});
