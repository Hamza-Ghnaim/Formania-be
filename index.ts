import express from "express";
import LoginRouter from "./routes/login.js";
import registerRouter from "./routes/registration.js";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./.env" });
const app = express();
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

db.connect((error: any) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected...");
  }
});

//Middleware
app.use(express.json());

//Login Router
app.use("/auth", LoginRouter(db));

app.use("/auth", registerRouter(db));

//Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the default route");
});

const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
