import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 📍 ดึงลูกค้าทั้งหมด
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
  }
});

// 📍 ดึงลูกค้าตาม ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(id, 10) },
    });

    if (!customer) {
      res.status(404).json({ error: "ไม่พบลูกค้านี้" });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
  }
});

// 📍 เพิ่มลูกค้าใหม่
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_code, fullname, email, phone, address_detail } = req.body;

    const newCustomer = await prisma.customer.create({
      data: { customer_code, fullname, email, phone, address_detail },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า" });
  }
});

export default router;
