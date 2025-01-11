import express from "express";
import bodyparser from "body-parser";
import userRouter from "./routes/users.js";

const app = express();
const PORT = 5000;
app.use(bodyparser.json());

app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the default route");
});
app.listen(PORT, () =>
  console.log(`Server Running on port: http://localhost:${PORT}`)
);
