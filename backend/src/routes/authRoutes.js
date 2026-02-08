import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/me", authenticateToken, (req,res) => {
  return res.status(200).json({ userId: req.user.userId });
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/refresh-token", refreshAccessToken);

export default router;
