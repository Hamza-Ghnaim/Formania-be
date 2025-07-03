import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import { Form } from "../models/Form.js";

export const createForm = async (req: Request, res: Response) => {
  try {
    const { title, fields } = req.body;
    const ownerId = (req as any).user?.userId;
    if (!title || !Array.isArray(fields)) {
      res.status(400).json({ message: "Invalid form data." });
    }

    const form = await Form.create({
      id: uuidv4(),
      title,
      fields,
      ownerId,
    });
    res.status(201).json(form);
  } catch (error) {
    console.error("Form creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
