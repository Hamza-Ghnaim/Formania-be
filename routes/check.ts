import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

export default () => {
  router.get("/check", authenticateUser, (req: any, res: any) => {
    console.log("Reyquest is:", req);
    if (!req.user) {
      console.log("!req.user", req);
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  });

  return router;
};
