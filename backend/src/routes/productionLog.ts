import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface CreateProductionLogBody {
  job_step_id: number;
  log_date: string;
  quantity: number;
  employee_id: number;
}

//ดึงทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.productionLog.findMany({
      include: {
        job: true,
        jobStep: { include: { job: true } },
        employee: true,
      },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
  }
});

//ดึงตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const log = await prisma.productionLog.findUnique({
      where: { log_id: parseInt(req.params.id, 10) },
      include: { job: true, jobStep: true, employee: true },
    });

    if (!log) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
  }
});

//เพิ่ม ProductionLog
router.post("/", async (req: Request<{}, {}, CreateProductionLogBody>, res: Response) => {
  const { job_step_id, log_date, quantity, employee_id } = req.body;

  if (!job_step_id || !log_date || !quantity || !employee_id) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    //หา job_id จาก job_step_id
    const jobStep = await prisma.jobStep.findUnique({
      where: { job_step_id },
      include: { job: true },
    });

    if (!jobStep || !jobStep.job) {
      return res.status(404).json({ error: "ไม่พบ Job หรือ JobStep ที่เลือก" });
    }

    //ดึง end_date จาก Job
    const endDate = jobStep.job.end_date;

    const newLog = await prisma.productionLog.create({
      data: {
        job_id: jobStep.job_id,
        job_step_id,
        log_date: new Date(log_date),
        quantity,
        employee_id,
        dateline_date: endDate, // ใช้ชื่อฟิลด์ให้ตรงกับ model
      },
    });

    res.status(201).json(newLog);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการเพิ่ม ProductionLog",
      details: error.message,
    });
  }
});

//แก้ไข ProductionLog
router.put("/:id", async (req: Request<{ id: string }, {}, CreateProductionLogBody>, res: Response) => {
  const { job_step_id, log_date, quantity, employee_id } = req.body;

  if (!job_step_id || !log_date || !quantity || !employee_id) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const logId = parseInt(req.params.id, 10);
    const existingLog = await prisma.productionLog.findUnique({ where: { log_id: logId } });
    if (!existingLog) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });

    //หา job_id และ end_date ใหม่จาก jobStep
    const jobStep = await prisma.jobStep.findUnique({
      where: { job_step_id },
      include: { job: true },
    });

    if (!jobStep || !jobStep.job) {
      return res.status(404).json({ error: "ไม่พบ Job หรือ JobStep ที่เลือก" });
    }

    const updatedLog = await prisma.productionLog.update({
      where: { log_id: logId },
      data: {
        job_id: jobStep.job_id,
        job_step_id,
        log_date: new Date(log_date),
        quantity,
        employee_id,
        dateline_date: jobStep.job.end_date, //แก้ชื่อฟิลด์ให้ตรง
      },
    });

    res.json(updatedLog);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการแก้ไข ProductionLog",
      details: error.message,
    });
  }
});

//ลบ ProductionLog
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const logId = parseInt(req.params.id, 10);
    const existingLog = await prisma.productionLog.findUnique({ where: { log_id: logId } });

    if (!existingLog) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });

    await prisma.productionLog.delete({ where: { log_id: logId } });

    res.json({ message: "ลบ ProductionLog เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ ProductionLog" });
  }
});

export default router;
