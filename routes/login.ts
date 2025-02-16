import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

export default (db: any) => {
  router.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: " Email and Password are required" });
    }

    try {
      const query = "Select * from users where email =?";
      db.query(query, [email], async (error: any, results: any) => {
        if (error) {
          console.error(
            "DataBase Error During query execution from ORM :",
            error
          );
          return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "User Not Found" });
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isPasswordValid) {
          return res.status(401).json({ Message: "Invalid Password" });
        }

        res.status(200).json({
          message: "Login Successfully",
          user: { id: user.id, username: user.username, email: user.email },
        });
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login." });
    }
  });
  return router;
};
