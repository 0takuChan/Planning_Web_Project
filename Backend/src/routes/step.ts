import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, Step } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม/แก้ไข Step
interface CreateStepBody {
  step_name: string;
  standard_time: number;
  priority?: number;
}

function parsePriority(value: unknown): number | null {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

//ดึง Step ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const steps: Step[] = await prisma.step.findMany();
    res.json(
      steps.sort((left, right) => {
        if (left.priority !== right.priority) {
          return left.priority - right.priority;
        }

        return left.step_id - right.step_id;
      })
    );
  } catch (error: any) {
    console.error("Error fetching Steps:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
  }
});

// ดึง Step ตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const step = await prisma.step.findUnique({
      where: { step_id: parseInt(id, 10) },
    });

    if (!step) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    res.json(step);
  } catch (error: any) {
    console.error("Error fetching Step:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
  }
});

// เพิ่ม Step
router.post("/", async (req: Request<{}, {}, CreateStepBody>, res: Response) => {
  const { step_name, standard_time, priority } = req.body;
  const parsedPriority = parsePriority(priority ?? 1);

  if (!step_name || !standard_time) {
  return res.status(400).json({ 
    error: "กรุณากรอกชื่อ Step และกำลังการผลิตสูงสุดต่อวัน" 
  });
}

  if (parsedPriority === null) {
    return res.status(400).json({ error: "priority ต้องเป็นจำนวนเต็มบวก" });
  }
  try {
    const newStep: Step = await prisma.step.create({
      data: { step_name, standard_time, priority: parsedPriority },
    });
    res.status(201).json(newStep);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Step ชื่อนี้มีอยู่แล้วในระบบ" });
    }
    console.error("Error creating Step:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล Step" });
  }
});

// แก้ไข Step
router.put("/:id", async (req: Request<{ id: string }, {}, CreateStepBody>, res: Response) => {
  const { id } = req.params;
  const { step_name, standard_time, priority } = req.body;
  const parsedPriority = parsePriority(priority ?? 1);

  if (!step_name || !standard_time) {
  return res.status(400).json({ 
    error: "กรุณากรอกชื่อ Step และกำลังการผลิตสูงสุดต่อวัน" 
  });
}

  if (parsedPriority === null) {
    return res.status(400).json({ error: "priority ต้องเป็นจำนวนเต็มบวก" });
  }

  try {
    const existingStep = await prisma.step.findUnique({
      where: { step_id: parseInt(id, 10) },
    });

    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    const stepId = parseInt(id, 10);

    // If standard_time changed, remove future plannings for related job_steps
    const standardTimeChanged = existingStep.standard_time !== standard_time;

    if (standardTimeChanged) {
      // find related job_step ids
      const relatedJobSteps = await prisma.jobStep.findMany({
        where: { step_id: stepId },
        select: { job_step_id: true },
      });

      const jobStepIds = relatedJobSteps.map(js => js.job_step_id);

      // compute today's date (midnight) for comparison
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDate = new Date(todayStr);

      // run update and deletions in a transaction
      const [updatedStep, deleteResult] = await prisma.$transaction([
        prisma.step.update({
          where: { step_id: stepId },
          data: { step_name, standard_time, priority: parsedPriority },
        }),
        prisma.planning.deleteMany({
          where: {
            job_step_id: { in: jobStepIds.length ? jobStepIds : [-1] },
            planned_date: { gte: todayDate },
          },
        }),
      ]);

      // After deletion, attempt to auto-generate plans for affected jobs
      const affectedJobSteps = await prisma.jobStep.findMany({
        where: { step_id: stepId },
        select: { job_id: true, job_step_id: true },
      });

      const jobStepsByJob = new Map<number, number[]>();
      for (const js of affectedJobSteps) {
        jobStepsByJob.set(js.job_id, (jobStepsByJob.get(js.job_id) || []).concat(js.job_step_id));
      }

      const replanResults: Array<{ job_id: number; job_step_id: number; success: boolean; message?: string }> = [];

      if (jobStepsByJob.size > 0) {
        const fetch = (await import('node-fetch-native')).default;
        const basePort = process.env.PORT || '4000';
        const baseUrl = `http://localhost:${basePort}`;
        const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
        const token = jwt.sign({ id: 0, username: 'system', role: 'system' }, JWT_SECRET, { expiresIn: '5m' });

        for (const [jobId, jobStepIds] of jobStepsByJob.entries()) {
          for (const jobStepId of jobStepIds) {
            try {
              const resp = await fetch(`${baseUrl}/api/plannings/auto-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ job_id: jobId, job_step_id: jobStepId, onlyFromToday: true }),
              });

              if (!resp.ok) {
                const errBody = await resp.text();
                replanResults.push({ job_id: jobId, job_step_id: jobStepId, success: false, message: `Auto-plan failed: ${resp.status} ${errBody}` });
                continue;
              }

              const body = await resp.json();
              replanResults.push({ job_id: jobId, job_step_id: jobStepId, success: true, message: body.message });
            } catch (err: any) {
              replanResults.push({ job_id: jobId, job_step_id: jobStepId, success: false, message: err?.message ?? String(err) });
            }
          }
        }
      }

      return res.json({ updatedStep, deletedPlannings: deleteResult.count, replanResults });
    }

    const updatedStep = await prisma.step.update({
      where: { step_id: parseInt(id, 10) },
      data: { step_name, standard_time, priority: parsedPriority },
    });

    res.json(updatedStep);
  } catch (error: any) {
    console.error("Error updating Step:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล Step" });
  }
});

// ลบ Step
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const stepId = parseInt(id, 10);

  try {
    const existingStep = await prisma.step.findUnique({
      where: { step_id: stepId },
    });

    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    // ตรวจสอบการใช้งาน Step ใน JobStep
    const relatedJobSteps = await prisma.jobStep.findMany({
      where: { step_id: stepId },
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
        productionLogs: {
          include: {
            employee: {
              select: {
                fullname: true
              }
            }
          }
        }
      }
    });

    if (relatedJobSteps.length > 0) {
      // แยกระหว่าง jobs ที่มี production logs และไม่มี
      const jobsWithLogs: string[] = [];
      const jobsWithoutLogs: string[] = [];

      relatedJobSteps.forEach(jobStep => {
        const jobInfo = `${jobStep.job.job_number} (${jobStep.job.customer.fullname})`;
        
        if (jobStep.productionLogs.length > 0) {
          const logInfo = jobStep.productionLogs.map(log => 
            `บันทึกวันที่ ${new Date(log.log_date).toLocaleDateString('th-TH')} จำนวน ${log.quantity} ชิ้น`
          ).join(", ");
          jobsWithLogs.push(`${jobInfo} - ${logInfo}`);
        } else {
          jobsWithoutLogs.push(jobInfo);
        }
      });

      let errorMessage = `ไม่สามารถลบ Step "${existingStep.step_name}" ได้ เนื่องจากกำลังถูกใช้งานในงาน`;

      if (jobsWithLogs.length > 0) {
        errorMessage += `\n\nงานที่มีบันทึกการผลิต:\n${jobsWithLogs.join('\n')}`;
      }

      if (jobsWithoutLogs.length > 0) {
        errorMessage += `\n\nงานที่ยังไม่มีบันทึกการผลิต:\n${jobsWithoutLogs.join(', ')}`;
      }

      return res.status(400).json({ 
        error: errorMessage,
        hasProductionLogs: jobsWithLogs.length > 0,
        jobsWithLogs: jobsWithLogs.length,
        jobsWithoutLogs: jobsWithoutLogs.length,
        totalJobs: relatedJobSteps.length
      });
    }

    // ถ้าไม่มีการใช้งาน ให้ลบได้
    await prisma.step.delete({
      where: { step_id: stepId },
    });

    res.json({ message: `ลบ Step "${existingStep.step_name}" เรียบร้อยแล้ว` });
  } catch (error: any) {
    console.error("Error deleting Step:", error);
    
    // จัดการ Foreign key constraint error
    if (error.code === "P2003") {
      return res.status(400).json({ 
        error: `ไม่สามารถลบ Step นี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่` 
      });
    }
    
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล Step" });
  }
});

// เพิ่ม endpoint สำหรับตรวจสอบการใช้งาน step ใน job
router.get("/:id/usage", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const stepId = parseInt(id, 10);

  try {
    const step = await prisma.step.findUnique({
      where: { step_id: stepId },
    });

    if (!step) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    // หาการใช้งานใน JobStep
    const relatedJobSteps = await prisma.jobStep.findMany({
      where: { step_id: stepId },
      include: {
        job: {
          select: {
            job_id: true,
            job_number: true,
            customer: {
              select: {
                fullname: true
              }
            }
          }
        },
        productionLogs: {
          include: {
            employee: {
              select: {
                fullname: true
              }
            }
          }
        }
      }
    });

    const usage = relatedJobSteps.map(jobStep => ({
      job_id: jobStep.job.job_id,
      job_number: jobStep.job.job_number,
      customer_name: jobStep.job.customer.fullname,
      has_production_logs: jobStep.productionLogs.length > 0,
      production_logs_count: jobStep.productionLogs.length,
      production_logs: jobStep.productionLogs.map(log => ({
        log_date: log.log_date,
        quantity: log.quantity,
        employee_name: log.employee.fullname
      }))
    }));

    res.json({
      step_id: stepId,
      step_name: step.step_name,
      priority: step.priority,
      is_used: usage.length > 0,
      total_jobs: usage.length,
      jobs_with_logs: usage.filter(u => u.has_production_logs).length,
      usage: usage
    });

  } catch (error: any) {
    console.error("Error checking step usage:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบการใช้งาน Step" });
  }
});

export default router;