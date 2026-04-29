import express, { Request, Response } from "express";
import { PrismaClient, Planning } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

function parseDateOnlyUtc(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function endOfDateOnlyUtc(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
}

async function getUsedMinutesForStepOnDate(
  stepId: number,
  plannedDate: string,
  excludePlanningId?: number
): Promise<number> {
  const plannings = await prisma.planning.findMany({
    where: {
      planned_date: {
        gte: parseDateOnlyUtc(plannedDate),
        lte: endOfDateOnlyUtc(plannedDate),
      },
      ...(excludePlanningId
        ? {
            NOT: {
              planning_id: excludePlanningId,
            },
          }
        : {}),
      jobStep: {
        step_id: stepId,
      },
    },
    select: {
      planned_quantity: true,
      jobStep: {
        select: {
          minutes_per_unit: true,
        },
      },
    },
  });

  return plannings.reduce((sum, planning) => {
    const minutesPerUnit = planning.jobStep.minutes_per_unit || 0;
    return sum + planning.planned_quantity * minutesPerUnit;
  }, 0);
}

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

// ลบ Planning ทั้งหมดของ Job
router.delete("/job/:jobId", async (req: Request<{ jobId: string }>, res: Response) => {
  const jobId = parseInt(req.params.jobId, 10);

  if (!Number.isInteger(jobId)) {
    return res.status(400).json({ error: "jobId ไม่ถูกต้อง" });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { job_id: jobId },
      select: {
        job_id: true,
        job_number: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: "ไม่พบ Job นี้" });
    }

    const deletedPlannings = await prisma.planning.deleteMany({
      where: { job_id: jobId },
    });

    return res.json({
      message: `ลบ Planning ของงาน ${job.job_number} เรียบร้อยแล้ว`,
      count: deletedPlannings.count,
    });
  } catch (error: any) {
    console.error("Error clearing plannings by job:", error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ Planning ของงานนี้" });
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
      include: { job: true, step: true },
    });

    if (!jobStep) return res.status(404).json({ error: "ไม่พบ JobStep นี้" });

    const job_id = jobStep.job.job_id; // ดึง job_id จาก relation

    // ตรวจสอบว่ามี Planning ซ้ำวันไหม
    const existingSameDay = await prisma.planning.findFirst({
      where: { job_step_id, planned_date: parseDateOnlyUtc(planned_date) },
    });

    // รวม planned_quantity ทั้งหมดของ job_step_id
    const allPlanned = await prisma.planning.aggregate({
      where: { job_step_id },
      _sum: { planned_quantity: true },
    });

    const newTotal = (allPlanned._sum.planned_quantity || 0) + planned_quantity;

    if (newTotal > jobStep.job.total_quantity) {
      return res.status(400).json({
        error: `จำนวนสินค้ารวมของขั้นตอนนี้ (${newTotal}) เกินจำนวนทั้งหมดของงาน (${jobStep.job.total_quantity})`,
      });
    }

    if (jobStep.minutes_per_unit && jobStep.minutes_per_unit > 0) {
      const usedMinutes = await getUsedMinutesForStepOnDate(jobStep.step_id, planned_date);
      const newMinutes = planned_quantity * jobStep.minutes_per_unit;
      const totalMinutes = usedMinutes + newMinutes;

      if (totalMinutes > jobStep.step.standard_time) {
        const remainingMinutes = Math.max(0, jobStep.step.standard_time - usedMinutes);
        const remainingUnits = Math.floor(remainingMinutes / jobStep.minutes_per_unit);
        return res.status(400).json({
          error: `วันที่ ${planned_date} ของขั้นตอน ${jobStep.step.step_name} ถูกใช้ไปแล้ว ${usedMinutes}/${jobStep.step.standard_time} นาที จึงเพิ่มได้อีกสูงสุด ${remainingUnits} ชิ้นในวันเดียวกันเท่านั้น`,
        });
      }
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
          planned_date: parseDateOnlyUtc(planned_date),
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
      include: { job: true, step: true },
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

    if (jobStep.minutes_per_unit && jobStep.minutes_per_unit > 0) {
      const usedMinutes = await getUsedMinutesForStepOnDate(
        jobStep.step_id,
        planned_date,
        existingPlanning.planning_id
      );
      const totalMinutes = usedMinutes + planned_quantity * jobStep.minutes_per_unit;

      if (totalMinutes > jobStep.step.standard_time) {
        const remainingMinutes = Math.max(0, jobStep.step.standard_time - usedMinutes);
        const remainingUnits = Math.floor(remainingMinutes / jobStep.minutes_per_unit);
        return res.status(400).json({
          error: `วันที่ ${planned_date} ของขั้นตอน ${jobStep.step.step_name} ถูกใช้ไปแล้ว ${usedMinutes}/${jobStep.step.standard_time} นาที จึงกำหนดได้อีกสูงสุด ${remainingUnits} ชิ้นในวันเดียวกันเท่านั้น`,
        });
      }
    }

    //update job_id ทุกครั้งเพื่อให้สัมพันธ์ถูกต้องเสมอ
    const updatedPlanning = await prisma.planning.update({
      where: { planning_id: existingPlanning.planning_id },
      data: {
        job_step_id,
        job_id,
          planned_date: parseDateOnlyUtc(planned_date),
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
