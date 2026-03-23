import express, { Request, Response } from "express";
import { PrismaClient, ShipmentStatus } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ดึงสถานะการจัดส่งทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const statuses: ShipmentStatus[] = await prisma.shipmentStatus.findMany({
      orderBy: { status_id: "asc" },
    });
    res.json(statuses);
  } catch (error: any) {
    console.error("Error fetching shipment statuses:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถานะการจัดส่ง" });
  }
});

export default router;