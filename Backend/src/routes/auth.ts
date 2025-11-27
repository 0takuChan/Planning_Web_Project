import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password);

  const user = await prisma.employee.findUnique({
    where: { username },
    include: { role: true }
  });

  console.log("User from DB:", user);

  if (!user) return res.status(401).json({ message: "Invalid username or password" });

  const valid = await bcrypt.compare(password, user.password);
  console.log("bcrypt compare result:", valid);

  if (!valid) return res.status(401).json({ message: "Invalid username or password" });

  const token = jwt.sign(
    {
      id: user.employee_id,
      username: user.username,
      role: user.role.role_name,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.employee_id,
      fullname: user.fullname,
      email: user.email,        // เพิ่มบรรทัดนี้
      phone: user.phone,        // เพิ่มบรรทัดนี้
      role: user.role.role_name,
    },
  });
});

router.get("/profile", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
