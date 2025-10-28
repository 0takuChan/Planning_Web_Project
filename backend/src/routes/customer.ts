import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ดึงลูกค้าทั้งหมด
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
  }
});

// ดึงลูกค้าตาม ID
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

// เพิ่มลูกค้าใหม่
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullname, email, phone, address_detail } = req.body;

    // ดึง customer_code ล่าสุด
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { customer_id: "desc" }, // เรียงตาม ID ล่าสุด
    });

    let newCode = "CM-000-0001"; // ค่าเริ่มต้น
    if (lastCustomer && lastCustomer.customer_code) {
      // แยกตัวเลขจาก customer_code ตัวอย่าง: "CM-000-0001"
      const lastNumber = parseInt(lastCustomer.customer_code.replace("CM-", "").replace(/-/g, ""), 10);
      const nextNumber = lastNumber + 1;

      // แปลงกลับเป็น format CM-000-000X
      const nextNumberStr = nextNumber.toString().padStart(7, "0"); // 7 หลัก
      newCode = `CM-${nextNumberStr.slice(0, 3)}-${nextNumberStr.slice(3)}`;
    }

    // สร้างลูกค้าใหม่
    const newCustomer = await prisma.customer.create({
      data: { 
        customer_code: newCode, 
        fullname, 
        email, 
        phone, 
        address_detail 
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า" });
  }
});


// แก้ไขข้อมูลลูกค้า
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { customer_code, fullname, email, phone, address_detail } = req.body;

  try {
    // ตรวจสอบว่าลูกค้ามีอยู่จริงหรือไม่
    const existingCustomer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(id, 10) },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: "ไม่พบลูกค้านี้" });
      return;
    }

    // อัปเดตข้อมูล
    const updatedCustomer = await prisma.customer.update({
      where: { customer_id: parseInt(id, 10) },
      data: { customer_code, fullname, email, phone, address_detail },
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลลูกค้า" });
  }
});


// ลบข้อมูลลูกค้า
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // ตรวจสอบว่ามีลูกค้าจริงไหม
    const existingCustomer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(id, 10) },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: "ไม่พบลูกค้านี้" });
      return;
    }

    // ลบข้อมูล
    await prisma.customer.delete({
      where: { customer_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูลลูกค้าเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า" });
  }
});

export default router;
