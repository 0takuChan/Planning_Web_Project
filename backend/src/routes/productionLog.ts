import express, { Request, Response } from "express";
import { PrismaClient, ProductionLog } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม ProductionLog
interface CreateProductionLogBody {
  job_id: number;
  job_step_id: number;
  log_date: string;    // client ส่งเป็น string
  actual_date: string; // client ส่งเป็น string
  quantity: number;
  employee_id: number;
}

// ดึง ProductionLog ทั้งหมด
router.get("/get/productionlogs", async (_req: Request, res: Response) => {
  try {
    const logs: ProductionLog[] = await prisma.productionLog.findMany({
      include: { job: true, jobStep: true, employee: true },
    });
    res.json(logs);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
  }
});

// เพิ่ม ProductionLog
router.post("/", async (req: Request<{}, {}, CreateProductionLogBody>, res: Response) => {
  const { job_id, job_step_id, log_date, actual_date, quantity, employee_id } = req.body;

  if (!job_id || !job_step_id || !log_date || !actual_date || !quantity || !employee_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newLog: ProductionLog = await prisma.productionLog.create({
      data: {
        job_id,
        job_step_id,
        log_date: new Date(log_date),
        actual_date: new Date(actual_date),
        quantity,
        employee_id,
      },
    });
    res.json(newLog);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "ProductionLog with this job_id and job_step_id already exists" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
  }
});

export default router;
