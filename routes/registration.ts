import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

export default (db: any) => {
  router.post("/register", async (req: any, res: any) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "all fields are required" });
    }

    try {
      const checkQuery = "SELECT * From users WHERE email=?";
      db.query(checkQuery, [email], async (error: any, results: any) => {
        if (error) {
          console.error("Database error during check query:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "email already in use" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const queryInsert =
          "INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)";

        db.query(
          queryInsert,
          [email, hashedPassword, username],
          async (error: any, results: any) => {
            if (error) {
              console.error("Error during user registration");
              return res.status(500).json({ message: "Internal Server Error" });
            }

            res.status(201).json({
              message: "Registration Successfull",
              user: { id: results.insertId, email, username },
            });
          }
        );
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred during registration." });
    }
  });
  return router;
};
