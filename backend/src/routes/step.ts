import express, { Request, Response } from "express";
import { PrismaClient, Step } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ดึง Step ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const steps: Step[] = await prisma.step.findMany();
    res.json(steps);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
  }
});

export default router;
