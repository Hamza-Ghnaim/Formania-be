import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

export default () => {
  router.get("/me", authenticateUser, (req: any, res: any) => {
    console.log("req.user", req);
    if (!req.user) {
      console.log("!req.user", req);
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ user: req.user });
  });

  return router;
};
