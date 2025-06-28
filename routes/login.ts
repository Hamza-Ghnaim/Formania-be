import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config(); // Ensure this line is at the top, before accessing process.env

interface LoginRequest {
  email: string;
  password: string;
}

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const router = express.Router();

router.post(
  "/login",
  async (req: express.Request<{}, {}, LoginRequest>, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: " Email and Password are required" });
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      });

      return res.status(200).json({
        message: "Login Successfully",
        user: { id: user.id, email: user.email, username: user.username },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login." });
    }
  }
);
export default router;
