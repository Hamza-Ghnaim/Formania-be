import express from "express";

const router = express.Router();

export default () => {
  router.get("/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged Out Successfully" });
  });

  return router;
};
