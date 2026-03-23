import express, { Request, Response } from "express";
import { PrismaClient, TransportType } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ดึงประเภทการขนส่งทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const transportTypes: TransportType[] = await prisma.transportType.findMany({
      orderBy: { transport_type_id: "asc" },
    });
    res.json(transportTypes);
  } catch (error: any) {
    console.error("Error fetching transport types:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการส่ง" });
  }
});

export default router;
