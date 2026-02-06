import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./src/controllers/authController.js";

const app = express();
dotenv.config();
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

app.listen(PORT, () => {
  console.log("Listening on PORT : ", PORT);
});

const posts = [
  {
    userId:"698495203e79e8ca43cbab95",
    title: "Post 1",
  },
  {
    userId:"698495203e797fca43cbab95",
    title: "Post 2",
  },
];

app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.userId === req.user.userId));
})

app.use("/api/auth", authRoutes);


app.get("/health", (req, res) => {
  res.send("all good");
});
