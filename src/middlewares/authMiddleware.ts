import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret"; // ideally from .env

// Attach decoded user to request
export function authenticateJWT(req: any, res: any, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded; // Inject user into request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Only allow users with role: 'provider'
export function onlyProvider(req: any, res: any, next: NextFunction) {
  if (req.user?.role !== "provider") {
    return res.status(403).json({ message: "Access denied. Providers only." });
  }
  next();
}
