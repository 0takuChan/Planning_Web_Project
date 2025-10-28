import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();

// ดึงพนักงานทั้งหมด
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: { role: true }, // ดึงข้อมูล role 
    });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
  }
});

// ดึงพนักงานตาม ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { employee_id: parseInt(id, 10) },
      include: { role: true },
    });
    if (!employee) {
      res.status(404).json({ error: "ไม่พบพนักงานนี้" });
      return;
    }
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
  }
});

// เพิ่มพนักงาน
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, username, password, email, phone, role_id } = req.body;

    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const existingUser = await prisma.employee.findUnique({
      where: { username },
    });
    if (existingUser) {
      res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
      return;
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.employee.create({
      data: {
        fullname,
        username,
        password: hashedPassword,
        email,
        phone,
        role_id,
      },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน" });
  }
});

// แก้ไขพนักงาน
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullname, email, phone, role_id } = req.body;
  try {
    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: parseInt(id, 10) },
      data: { fullname, email, phone, role_id },
    });
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลพนักงานได้" });
  }
});

// ลบพนักงาน
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.employee.delete({
      where: { employee_id: parseInt(id, 10) },
    });
    res.json({ message: "ลบพนักงานเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "ไม่สามารถลบพนักงานได้" });
  }
});

export default router;
