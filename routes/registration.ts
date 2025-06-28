import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req: any, res: any) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "all fields are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "email already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      username,
      password_hash: hashedPassword,
    });
    return res.status(201).json({
      message: "Registration Successfull",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});
export default router;
