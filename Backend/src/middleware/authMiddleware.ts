import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}


declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
