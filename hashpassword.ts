import bcrypt from "bcrypt";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create database connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const email = "hamzaghnaim99@gmail.com";
const plainPassword = "Hamza#99"; // Change this to the actual password before hashing

const hashpassword = async () => {
  try {
    const saltRounds = 10; // Higher value = more security but slower
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const query = "UPDATE users SET password_hash = ? WHERE email = ?";
    db.query(query, [hashedPassword, email], (error, results) => {
      if (error) {
        console.error("Error updating password:", error);
      } else {
        console.log("Password updated successfully!");
      }
      db.end(); // Close connection
    });
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

hashpassword();
