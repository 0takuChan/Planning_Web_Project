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
    return res.status(400).json({ error: "กรุณากรอก job_id และ step_id" });
  }

  try {
    const newJobStep: JobStep = await prisma.jobStep.create({
      data: { job_id, step_id },
    });
    res.status(201).json(newJobStep);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "JobStep นี้มีอยู่แล้วในระบบ" });
    }
    console.error("Error creating JobStep:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล JobStep" });
  }
});

// แก้ไข JobStep
router.put("/:id", async (req: Request<{ id: string }, {}, CreateJobStepBody>, res: Response) => {
  const { id } = req.params;
  const { job_id, step_id } = req.body;

  if (!job_id || !step_id) {
    return res.status(400).json({ error: "กรุณากรอก job_id และ step_id" });
  }

  try {
    const existingJobStep = await prisma.jobStep.findUnique({
      where: { job_step_id: parseInt(id, 10) },
    });

    if (!existingJobStep) {
      return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
    }

    const updatedJobStep = await prisma.jobStep.update({
      where: { job_step_id: parseInt(id, 10) },
      data: { job_id, step_id },
    });

    res.json(updatedJobStep);
  } catch (error: any) {
    console.error("Error updating JobStep:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล JobStep" });
  }
});

// ลบ JobStep
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const jobStepId = parseInt(id, 10);

  try {
    const existingJobStep = await prisma.jobStep.findUnique({
      where: { job_step_id: jobStepId },
      include: {
        job: {
          select: {
            job_number: true,
            customer: {
              select: {
                fullname: true
              }
            }
          }
        },
        step: {
          select: {
            step_name: true
          }
        }
      }
    });

    if (!existingJobStep) {
      return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
    }

    // ตรวจสอบการใช้งานใน ProductionLog
    const relatedProductionLogs = await prisma.productionLog.findMany({
      where: { job_step_id: jobStepId },
      include: {
        employee: {
          select: {
            fullname: true
          }
        }
      }
    });

    if (relatedProductionLogs.length > 0) {
      const logDetails = relatedProductionLogs.map(log => 
        `วันที่ ${new Date(log.log_date).toLocaleDateString('th-TH')} จำนวน ${log.quantity} ชิ้น โดย ${log.employee.fullname}`
      ).join(", ");

      return res.status(400).json({ 
        error: `ไม่สามารถลบ Step "${existingJobStep.step.step_name}" จากงาน "${existingJobStep.job.job_number}" ได้ เนื่องจากมีบันทึกการผลิต: ${logDetails}`,
        hasProductionLogs: true,
        productionLogsCount: relatedProductionLogs.length
      });
    }

    await prisma.jobStep.delete({
      where: { job_step_id: jobStepId },
    });

    res.json({ 
      message: `ลบ Step "${existingJobStep.step.step_name}" จากงาน "${existingJobStep.job.job_number}" เรียบร้อยแล้ว` 
    });
  } catch (error: any) {
    console.error("Error deleting JobStep:", error);
    
    if (error.code === "P2003") {
      return res.status(400).json({ 
        error: "ไม่สามารถลบ JobStep นี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่" 
      });
    }
    
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล JobStep" });
  }
});

export default router;
