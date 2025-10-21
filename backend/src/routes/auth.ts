import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// คีย์สำหรับ JWT (ควรใช้จาก .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password }: { username: string; password: string } = req.body;

  try {
    const employee = await prisma.employee.findUnique({
      where: { username },
      include: { role: true },
    });

    if (!employee) {
      res.status(404).json({ error: "ไม่พบผู้ใช้นี้" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
      return;
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: employee.employee_id, role: employee.role.role_name },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: employee.employee_id,
        fullname: employee.fullname,
        role: employee.role.role_name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
});

export default router;
