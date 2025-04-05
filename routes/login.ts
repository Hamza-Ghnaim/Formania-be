import express from "express";
import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Pool } from "mysql2/promise";

dotenv.config(); // Ensure this line is at the top, before accessing process.env

interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const router = express.Router();

export default (pool: Pool) => {
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
        const query = "Select * from users where email =?";
        const [rows] = await pool.query(query, [email]);
        const results = rows as User[];
        if (results.length === 0) {
          return res.status(400).json({ message: "User not Found" });
        }
        const user = results[0];

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
  return router;
};
