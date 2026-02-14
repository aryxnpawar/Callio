import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const getAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

const getRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is reqired" });
    }
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res.status(403).json({ message: "No such User" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = getAccessToken(user);
        return res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //add error handling for empty body
    //add error handling for invalid post request
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      userId: user._id,
      accessToken: accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //add error handling for empty body
    //add error handling for invalid post request

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const accessToken = getAccessToken(newUser);
    const refreshToken = getRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, cookieOptions);

    console.log(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
      accessToken: accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
