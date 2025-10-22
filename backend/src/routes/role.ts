import express, { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ดึง Role ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const roles: Role[] = await prisma.role.findMany();
    res.json(roles);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Role" });
  }
});

export default router;
