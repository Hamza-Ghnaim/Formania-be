// types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust `any` to a more specific user type if needed
    }
  }
}

export {}; // Ensures this file is treated as a module
