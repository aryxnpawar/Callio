import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log("Listening on PORT : ", PORT);
});

app.use("/api/auth", authRoutes);

app.get("/post", (req, res) => {
  res.send(posts.filter((post) => post.email === req.query.email));
});

app.get("/health", (req, res) => {
  res.send("all good");
});
