import express, { Request, Response } from "express";
import { PrismaClient, JobStep } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่มหรือแก้ไข JobStep
interface CreateJobStepBody {
  job_id: number;
  step_id: number;
}

// ดึง JobStep ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobsteps: JobStep[] = await prisma.jobStep.findMany({
      include: { job: true, step: true },
    });
    res.json(jobsteps);
  } catch (error: any) {
    console.error("Error fetching JobSteps:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
  }
});

// ดึง JobStep ตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const jobstep = await prisma.jobStep.findUnique({
      where: { job_step_id: parseInt(id, 10) },
      include: { job: true, step: true },
    });

    if (!jobstep) {
      return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
    }

    res.json(jobstep);
  } catch (error: any) {
    console.error("Error fetching JobStep:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
  }
});

// เพิ่ม JobStep
router.post("/", async (req: Request<{}, {}, CreateJobStepBody>, res: Response) => {
  const { job_id, step_id } = req.body;

  if (!job_id || !step_id) {
    return res.status(400).json({ error: "job_id และ step_id จำเป็นต้องกรอก" });
  }

  try {
    const newJobStep: JobStep = await prisma.jobStep.create({
      data: { job_id, step_id },
    });
    res.status(201).json(newJobStep);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "JobStep ที่มี job_id และ step_id นี้มีอยู่แล้วในระบบ",
      });
    }
    console.error("Error creating JobStep:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล JobStep" });
  }
});

// // แก้ไข JobStep
// router.put("/:id", async (req: Request<{ id: string }, {}, CreateJobStepBody>, res: Response) => {
//   const { id } = req.params;
//   const { job_id, step_id } = req.body;

//   if (!job_id || !step_id) {
//     return res.status(400).json({ error: "job_id และ step_id จำเป็นต้องกรอก" });
//   }

//   try {
//     // ตรวจสอบว่า JobStep มีอยู่จริงไหม
//     const existingJobStep = await prisma.jobStep.findUnique({
//       where: { job_step_id: parseInt(id, 10) },
//     });

//     if (!existingJobStep) {
//       return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
//     }

//     // แก้ไขข้อมูล
//     const updatedJobStep = await prisma.jobStep.update({
//       where: { job_step_id: parseInt(id, 10) },
//       data: { job_id, step_id },
//     });

//     res.json(updatedJobStep);
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return res.status(400).json({
//         error: "มี JobStep ที่ใช้ job_id และ step_id นี้อยู่แล้วในระบบ",
//       });
//     }
//     console.error("Error updating JobStep:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล JobStep" });
//   }
// });

// ลบ JobStep
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    // ตรวจสอบว่ามีอยู่จริงไหม
    const existingJobStep = await prisma.jobStep.findUnique({
      where: { job_step_id: parseInt(id, 10) },
    });

    if (!existingJobStep) {
      return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
    }

    // ลบข้อมูล
    await prisma.jobStep.delete({
      where: { job_step_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูล JobStep เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error deleting JobStep:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล JobStep" });
  }
});

export default router;
