import bycrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await bycrypt.hash(password, 12);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
