import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

// Define a custom request interface that includes the 'user' property
interface AuthRequest extends Request {
  user?: any;
}

// Middleware function to verify the JWT token
export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> | void => {
  // return type is either void or Promise<void>
  return new Promise((resolve) => {
    try {
      // 1️⃣ Extract token from cookies
      const token = req.cookies?.token;

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      // 2️⃣ Verify the token using the secret key
      jwt.verify(token, SECRET_KEY as string, (err: any, decoded: any) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        }

        // 3️⃣ Attach user data to the request object (useful in protected routes)
        req.user = decoded;

        // 4️⃣ Proceed to the next middleware or route handler
        next();
        resolve(); // resolve the promise when the next() function is called
      });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  });
};
