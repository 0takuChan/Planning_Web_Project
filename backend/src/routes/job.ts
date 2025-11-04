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

  try {
    // ตรวจสอบว่างานนี้มีอยู่จริงหรือไม่
    const existingJob = await prisma.job.findUnique({
      where: { job_id: parseInt(id, 10) },
    });

    if (!existingJob) {
      res.status(404).json({ error: "ไม่พบงานนี้" });
      return;
    }

    await prisma.job.delete({
      where: { job_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูลงานเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูลงาน" });
  }
});

export default router;
