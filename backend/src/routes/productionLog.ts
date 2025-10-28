import express, { Request, Response } from "express";
import { PrismaClient, ProductionLog } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface CreateProductionLogBody {
  job_id: number;
  job_step_id: number;
  log_date: string;
  actual_date: string;
  quantity: number;
  employee_id: number;
}

// ดึง ProductionLog ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
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

// ดึง ProductionLog ตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const log = await prisma.productionLog.findUnique({
      where: { log_id: parseInt(id, 10) },
      include: { job: true, jobStep: true, employee: true },
    });

    if (!log) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });
    res.json(log);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
  }
});

// // เพิ่ม ProductionLog
// router.post("/", async (req: Request<{}, {}, CreateProductionLogBody>, res: Response) => {
//   const { job_id, job_step_id, log_date, actual_date, quantity, employee_id } = req.body;

//   if (!job_id || !job_step_id || !log_date || !actual_date || !quantity || !employee_id) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const newLog: ProductionLog = await prisma.productionLog.create({
//       data: {
//         job_id,
//         job_step_id,
//         log_date: new Date(log_date),
//         actual_date: new Date(actual_date),
//         quantity,
//         employee_id,
//       },
//     });
//     res.status(201).json(newLog);
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return res.status(400).json({ error: "Duplicate entry for this job_id and job_step_id" });
//     }
//     console.error(error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
//   }
// });

// // แก้ไข ProductionLog
// router.put("/:id", async (req: Request<{ id: string }, {}, CreateProductionLogBody>, res: Response) => {
//   const { id } = req.params;
//   const { job_id, job_step_id, log_date, actual_date, quantity, employee_id } = req.body;

//   if (!job_id || !job_step_id || !log_date || !actual_date || !quantity || !employee_id) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     // ตรวจสอบว่ามี ProductionLog นี้หรือไม่
//     const existingLog = await prisma.productionLog.findUnique({
//       where: { log_id: parseInt(id, 10) },
//     });

//     if (!existingLog) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });

//     const updatedLog = await prisma.productionLog.update({
//       where: { log_id: parseInt(id, 10) },
//       data: {
//         job_id,
//         job_step_id,
//         log_date: new Date(log_date),
//         actual_date: new Date(actual_date),
//         quantity,
//         employee_id,
//       },
//     });

//     res.json(updatedLog);
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return res.status(400).json({ error: "Duplicate entry for this job_id and job_step_id" });
//     }
//     console.error(error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไข ProductionLog" });
//   }
// });

// ลบ ProductionLog
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const existingLog = await prisma.productionLog.findUnique({
      where: { log_id: parseInt(id, 10) },
    });

    if (!existingLog) return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });

    await prisma.productionLog.delete({
      where: { log_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบ ProductionLog เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ ProductionLog" });
  }
});

export default router;
