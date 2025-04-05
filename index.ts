import express from "express";
import LoginRouter from "./routes/login.js";
import registerRouter from "./routes/registration.js";
import checkRoter from "./routes/check.js";
import AuthRouter from "./routes/me.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./config/db.js";

dotenv.config({ path: "./.env" });
const app = express();
// const db = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE,
// });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Connected ...");
    connection.release();
  } catch (error) {
    console.error("MySQL Connection Error,", error);
    process.exit(1);
  }
}

// db.connect((error: mysql.QueryError | null) => {
//   if (error) {
//     console.log("MySQL connection error:", error);
//   } else {
//     console.log("MySQL connected...");
//   }
// });

//Middleware
app.use(cookieParser());

app.use(express.json());

//Login Router
app.use("/auth", LoginRouter(pool));

app.use("/auth", registerRouter(pool));

app.use("/auth", AuthRouter());

app.use("/auth", checkRoter());

//Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the default route");
});

const PORT = 5000;

testDbConnection().then(() => {
  app.listen(PORT, () =>
    console.log(`Server Running on port: http://localhost:${PORT}`)
  );
});
