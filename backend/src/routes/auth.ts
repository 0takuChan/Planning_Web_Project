import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", username, password); // password จาก frontend

  const user = await prisma.employee.findUnique({ where: { username } });
  console.log("User from DB:", user);
  if (!user) return res.status(401).json({ message: "Invalid username or password" });
  

  console.log("Password in DB:", user.password); // password hash จาก DB

  const valid = await bcrypt.compare(password, user.password);
  console.log("bcrypt compare result:", valid);

  if (!valid) return res.status(401).json({ message: "Invalid username or password" });

  res.json({ user: { id: user.employee_id, username: user.username } });
});


export default router;
