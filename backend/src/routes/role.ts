import express, { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับรับข้อมูลจาก body
interface CreateRoleBody {
  role_name: string;
}

//ดึง Role ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const roles: Role[] = await prisma.role.findMany();
    res.json(roles);
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Role" });
  }
});

// ดึง Role ตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const role = await prisma.role.findUnique({
      where: { role_id: parseInt(id, 10) },
    });

    if (!role) {
      return res.status(404).json({ error: "ไม่พบ Role ที่ระบุ" });
    }

    res.json(role);
  } catch (error: any) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Role" });
  }
});

// เพิ่ม Role ใหม่
router.post("/", async (req: Request<{}, {}, CreateRoleBody>, res: Response) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ Role" });
  }

  try {
    const newRole: Role = await prisma.role.create({
      data: { role_name },
    });

    res.status(201).json(newRole);
  } catch (error: any) {
    console.error("Error creating role:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Role ชื่อนี้มีอยู่แล้ว" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล Role" });
  }
});

// แก้ไข Role ตาม ID
router.put("/:id", async (req: Request<{ id: string }, {}, CreateRoleBody>, res: Response) => {
  const { id } = req.params;
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ Role" });
  }

  try {
    const existingRole = await prisma.role.findUnique({
      where: { role_id: parseInt(id, 10) },
    });

    if (!existingRole) {
      return res.status(404).json({ error: "ไม่พบ Role นี้" });
    }

    const updatedRole = await prisma.role.update({
      where: { role_id: parseInt(id, 10) },
      data: { role_name },
    });

    res.json(updatedRole);
  } catch (error: any) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล Role" });
  }
});

// ลบ Role ตาม ID
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const existingRole = await prisma.role.findUnique({
      where: { role_id: parseInt(id, 10) },
    });

    if (!existingRole) {
      return res.status(404).json({ error: "ไม่พบ Role นี้" });
    }

    await prisma.role.delete({
      where: { role_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูล Role เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error deleting role:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล Role" });
  }
});

export default router;
