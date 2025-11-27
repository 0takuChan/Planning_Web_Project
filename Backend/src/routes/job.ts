import express, { Request, Response } from "express";
import { PrismaClient, Job } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม/แก้ไขงาน
interface CreateJobBody {
  job_number: string;
  created_date: string;
  end_date: string;
  customer_id: number;
  total_quantity: number;
  clothing_type: string;
  type_of_fabric: string;
  employee_id: number;
  delivery_location: string;
}


// ดึงงานทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const jobs: Job[] = await prisma.job.findMany({
      include: {
        customer: true,
        employee: true,
      },
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// ดึงงานตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const job: Job | null = await prisma.job.findUnique({
      where: { job_id: parseInt(id, 10) },
      include: {
        customer: true,
        employee: true,
      },
    });

    if (!job) {
      res.status(404).json({ error: "ไม่พบงานนี้" });
      return;
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// เพิ่มงาน
router.post("/", async (req: Request<{}, {}, Omit<CreateJobBody, "job_number">>, res: Response) => {
  try {
    const {
      created_date,
      end_date,
      customer_id,
      total_quantity,
      clothing_type,
      type_of_fabric,
      employee_id,
      delivery_location,
    } = req.body;

    const currentYear = new Date().getFullYear();

    // ดึง job_number ล่าสุดของปีปัจจุบัน
    const lastJob = await prisma.job.findFirst({
      where: {
        job_number: { startsWith: `JO-${currentYear}-` },
      },
      orderBy: { job_id: "desc" },
    });

    let nextNumber = "0001";
    if (lastJob && lastJob.job_number) {
      const lastSeq = parseInt(lastJob.job_number.split("-")[2], 10);
      nextNumber = (lastSeq + 1).toString().padStart(4, "0");
    }

    const job_number = `JO-${currentYear}-${nextNumber}`;

    // สร้างงานใหม่
    const newJob: Job = await prisma.job.create({
      data: {
        job_number,
        created_date: new Date(created_date),
        end_date: new Date(end_date),
        customer_id,
        total_quantity,
        clothing_type,
        type_of_fabric,
        employee_id,
        delivery_location,
      },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลงาน" });
  }
});

// แก้ไขข้อมูลงาน
router.put("/:id", async (req: Request<{ id: string }, {}, CreateJobBody>, res: Response) => {
  const { id } = req.params;
  const {
    job_number,
    created_date,
    end_date,
    customer_id,
    total_quantity,
    clothing_type,
    type_of_fabric,
    employee_id,
    delivery_location,
  } = req.body;

  try {
    // ตรวจสอบว่างานนี้มีอยู่จริงหรือไม่
    const existingJob = await prisma.job.findUnique({
      where: { job_id: parseInt(id, 10) },
    });

    if (!existingJob) {
      res.status(404).json({ error: "ไม่พบงานนี้" });
      return;
    }

    // อัปเดตข้อมูลงาน
    const updatedJob = await prisma.job.update({
      where: { job_id: parseInt(id, 10) },
      data: {
        job_number,
        created_date: new Date(created_date),
        end_date: new Date(end_date),
        customer_id,
        total_quantity,
        clothing_type,
        type_of_fabric,
        employee_id,
        delivery_location,
      },
    });

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลงาน" });
  }
});

// ลบข้อมูลงาน
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const jobId = parseInt(id, 10);

  try {
    // ตรวจสอบว่างานนี้มีอยู่จริงหรือไม่
    const existingJob = await prisma.job.findUnique({
      where: { job_id: jobId },
      include: {
        customer: {
          select: {
            fullname: true
          }
        }
      }
    });

    if (!existingJob) {
      res.status(404).json({ error: "ไม่พบงานนี้" });
      return;
    }

    console.log(`Deleting job ${jobId} and related data...`);

    // ตรวจสอบข้อมูลที่เชื่อมโยงก่อนลบ
    const [relatedJobSteps, relatedPlannings, relatedProductionLogs] = await Promise.all([
      prisma.jobStep.findMany({
        where: { job_id: jobId },
        include: {
          step: { select: { step_name: true } }
        }
      }),
      prisma.planning.findMany({
        where: { job_id: jobId }
      }),
      prisma.productionLog.findMany({
        where: { job_id: jobId },
        include: {
          employee: { select: { fullname: true } },
          jobStep: {
            include: {
              step: { select: { step_name: true } }
            }
          }
        }
      })
    ]);

    // ถ้ามี production logs ให้แสดง error พร้อมรายละเอียด
    if (relatedProductionLogs.length > 0) {
      const logDetails = relatedProductionLogs.map(log => 
        `${log.jobStep.step.step_name}: ${log.quantity} ชิ้น วันที่ ${new Date(log.log_date).toLocaleDateString('th-TH')} โดย ${log.employee.fullname}`
      ).join(', ');

      return res.status(400).json({ 
        error: `ไม่สามารถลบงาน "${existingJob.job_number}" (${existingJob.customer.fullname}) ได้\n\nเนื่องจากมีบันทึกการผลิตดังนี้:\n${logDetails}\n\nกรุณาลบบันทึกการผลิตเหล่านี้ก่อน หรือติดต่อผู้ดูแลระบบ`,
        hasProductionLogs: true,
        productionLogsCount: relatedProductionLogs.length,
        job_number: existingJob.job_number,
        customer_name: existingJob.customer.fullname
      });
    }

    // ถ้ามี planning data ให้แสดง warning
    if (relatedPlannings.length > 0) {
      console.log(`Job has ${relatedPlannings.length} planning records that will be deleted`);
    }

    // ใช้ transaction เพื่อความปลอดภัย
    await prisma.$transaction(async (tx) => {
      // ขั้นตอน 1: ลบ Planning ที่เกี่ยวข้องก่อน (ถ้ามี)
      if (relatedPlannings.length > 0) {
        const deletedPlannings = await tx.planning.deleteMany({
          where: { job_id: jobId },
        });
        console.log(`Deleted ${deletedPlannings.count} planning records for job ${jobId}`);
      }

      // ขั้นตอน 2: ลบ JobSteps ที่เกี่ยวข้อง
      if (relatedJobSteps.length > 0) {
        const deletedJobSteps = await tx.jobStep.deleteMany({
          where: { job_id: jobId },
        });
        console.log(`Deleted ${deletedJobSteps.count} job steps for job ${jobId}`);
      }

      // ขั้นตอน 3: ลบ Job
      await tx.job.delete({
        where: { job_id: jobId },
      });
      
      console.log(`Job ${jobId} deleted successfully`);
    });

    res.json({ 
      message: `ลบงาน "${existingJob.job_number}" (${existingJob.customer.fullname}) และข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว`,
      job_id: jobId,
      job_number: existingJob.job_number,
      customer_name: existingJob.customer.fullname,
      deleted_job_steps: relatedJobSteps.length,
      deleted_plannings: relatedPlannings.length
    });
    
  } catch (error: any) {
    console.error("Error deleting job:", error);
    
    // จัดการ error แต่ละประเภท
    if (error.code === "P2003") {
      return res.status(400).json({ 
        error: `ไม่สามารถลบงานนี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่ในระบบ\n\nกรุณาตรวจสอบและลบข้อมูลดังนี้ก่อน:\n• บันทึกการผลิต (Production Logs)\n• ข้อมูลการวางแผน (Planning)\n• ขั้นตอนการผลิต (Job Steps)\n\nหรือติดต่อผู้ดูแลระบบเพื่อขอความช่วยเหลือ`,
        errorCode: "FOREIGN_KEY_CONSTRAINT",
        job_id: jobId
      });
    }
    
    if (error.code === "P2025") {
      return res.status(404).json({ 
        error: "ไม่พบงานที่ต้องการลบ อาจถูกลบไปแล้วหรือไม่มีอยู่ในระบบ",
        errorCode: "RECORD_NOT_FOUND",
        job_id: jobId
      });
    }
    
    res.status(500).json({ 
      error: "เกิดข้อผิดพลาดในการลบข้อมูลงาน กรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ",
      errorCode: "INTERNAL_SERVER_ERROR",
      job_id: jobId
    });
  }
});

export default router;
