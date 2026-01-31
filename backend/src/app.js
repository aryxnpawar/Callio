import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 8080;
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

app.listen(PORT, () => {
  console.log("Listening on PORT : ", PORT);
});

app.use("/api/auth",authRoutes);

app.get("/health", (req, res) => {
  res.send("all good");
});
