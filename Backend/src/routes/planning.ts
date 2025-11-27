import express, { Request, Response } from "express";
import { PrismaClient, Planning } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface CreatePlanningBody {
  job_step_id: number;
  planned_date: string;
  planned_quantity: number;
}

// ดึง Planning ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const plannings: Planning[] = await prisma.planning.findMany({
      include: { jobStep: { include: { job: true, step: true } } },
    });
    res.json(plannings);
  } catch (error: any) {
    console.error("Error fetching plannings:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Planning" });
  }
});

// ดึง Planning ตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const planning = await prisma.planning.findUnique({
      where: { planning_id: parseInt(id, 10) },
      include: { jobStep: { include: { job: true, step: true } } },
    });

    if (!planning) {
      return res.status(404).json({ error: "ไม่พบข้อมูล Planning นี้" });
    }

    res.json(planning);
  } catch (error: any) {
    console.error("Error fetching planning:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Planning" });
  }
});

// เพิ่ม Planning
router.post("/", async (req: Request<{}, {}, CreatePlanningBody>, res: Response) => {
  const { job_step_id, planned_date, planned_quantity } = req.body;

  if (!job_step_id || !planned_date || planned_quantity === undefined) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    //ตรวจสอบว่า job_step_id มีอยู่จริงไหม และดึง job_id มาด้วย
    const jobStep = await prisma.jobStep.findUnique({
      where: { job_step_id },
      include: { job: true },
    });

    if (!jobStep) return res.status(404).json({ error: "ไม่พบ JobStep นี้" });

    const job_id = jobStep.job.job_id; // ดึง job_id จาก relation

    // ตรวจสอบว่ามี Planning ซ้ำวันไหม
    const existingSameDay = await prisma.planning.findFirst({
      where: { job_step_id, planned_date: new Date(planned_date) },
    });

    // รวม planned_quantity ทั้งหมดของ job_step_id
    const allPlanned = await prisma.planning.aggregate({
      where: { job_step_id },
      _sum: { planned_quantity: true },
    });

    const currentPlanned = existingSameDay ? existingSameDay.planned_quantity : 0;
    const newTotal = (allPlanned._sum.planned_quantity || 0) - currentPlanned + planned_quantity;

    if (newTotal > jobStep.job.total_quantity) {
      return res.status(400).json({
        error: `จำนวนสินค้ารวมของขั้นตอนนี้ (${newTotal}) เกินจำนวนทั้งหมดของงาน (${jobStep.job.total_quantity})`,
      });
    }

    let planning;
    if (existingSameDay) {
      planning = await prisma.planning.update({
        where: { planning_id: existingSameDay.planning_id },
        data: {
          planned_quantity: existingSameDay.planned_quantity + planned_quantity,
          job_id, // เพิ่ม job_id ให้แน่ใจว่าอัปเดตสัมพันธ์ถูกต้อง
        },
      });
    } else {
      planning = await prisma.planning.create({
        data: {
          job_step_id,
          job_id, // เพิ่มอัตโนมัติ
          planned_date: new Date(planned_date),
          planned_quantity,
        },
      });
    }

    res.status(201).json(planning);
  } catch (error: any) {
    console.error("Error creating planning:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล Planning" });
  }
});


// แก้ไข Planning 
router.put("/:id", async (req: Request<{ id: string }, {}, CreatePlanningBody>, res: Response) => {
  const { id } = req.params;
  const { job_step_id, planned_date, planned_quantity } = req.body;

  if (!job_step_id || !planned_date || planned_quantity === undefined) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
  }

  try {
    const existingPlanning = await prisma.planning.findUnique({
      where: { planning_id: parseInt(id, 10) },
    });
    if (!existingPlanning)
      return res.status(404).json({ error: "ไม่พบข้อมูล Planning นี้" });

    //ดึง job_id ที่สัมพันธ์กับ job_step_id ใหม่
    const jobStep = await prisma.jobStep.findUnique({
      where: { job_step_id },
      include: { job: true },
    });
    if (!jobStep) return res.status(404).json({ error: "ไม่พบ JobStep นี้" });

    const job_id = jobStep.job.job_id; // ดึง job_id จาก relation

    const allPlanned = await prisma.planning.aggregate({
      where: {
        job_step_id,
        NOT: { planning_id: existingPlanning.planning_id },
      },
      _sum: { planned_quantity: true },
    });

    const newTotal = (allPlanned._sum.planned_quantity || 0) + planned_quantity;

    if (newTotal > jobStep.job.total_quantity) {
      return res.status(400).json({
        error: `จำนวนสินค้ารวมของขั้นตอนนี้ (${newTotal}) เกินจำนวนทั้งหมดของงาน (${jobStep.job.total_quantity})`,
      });
    }

    //update job_id ทุกครั้งเพื่อให้สัมพันธ์ถูกต้องเสมอ
    const updatedPlanning = await prisma.planning.update({
      where: { planning_id: existingPlanning.planning_id },
      data: {
        job_step_id,
        job_id,
        planned_date: new Date(planned_date),
        planned_quantity,
      },
    });

    res.json(updatedPlanning);
  } catch (error: any) {
    console.error("Error updating planning:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล Planning" });
  }
});


// ลบ Planning
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const existingPlanning = await prisma.planning.findUnique({
      where: { planning_id: parseInt(id, 10) },
    });

    if (!existingPlanning) {
      return res.status(404).json({ error: "ไม่พบข้อมูล Planning นี้" });
    }

    await prisma.planning.delete({
      where: { planning_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูล Planning เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error deleting planning:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล Planning" });
  }
});

export default router;
