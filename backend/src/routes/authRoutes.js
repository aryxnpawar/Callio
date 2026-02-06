import express from "express";
import { registerUser, loginUser,authenticateToken } from "../controllers/authController.js";

const router = express.Router();

const posts = [
  { email: "aryan@gmail.com", post: "Hello World" },
  { email: "john", post: "Hello John" },
];

router.get("/posts", authenticateToken, (req, res) => {
    res.json(posts.filter((post) => post.email === req.user.email));
});

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
