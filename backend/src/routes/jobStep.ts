import express, { Request, Response } from "express";
import { PrismaClient, JobStep } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม JobStep
interface CreateJobStepBody {
  job_id: number;
  step_id: number;
}

// ดึงขั้นตอนงานทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobsteps: JobStep[] = await prisma.jobStep.findMany({
      include: { job: true, step: true },
    });
    res.json(jobsteps);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
  }
});

// เพิ่ม JobStep
router.post("/", async (req: Request<{}, {}, CreateJobStepBody>, res: Response) => {
  const { job_id, step_id } = req.body;

  if (!job_id || !step_id) {
    return res.status(400).json({ error: "job_id and step_id are required" });
  }

  try {
    const newJobStep: JobStep = await prisma.jobStep.create({
      data: {
        job_id,
        step_id,
      },
    });
    res.json(newJobStep);
  } catch (error: any) {
    // ตรวจสอบ Prisma unique constraint violation
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "JobStep with this job_id and step_id already exists" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
  }
});

export default router;
