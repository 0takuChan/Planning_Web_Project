import express, { Request, Response } from "express";
import { PrismaClient, Job } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่มงาน
interface CreateJobBody {
  job_number: string;
  created_date: string; // หรือ Date ก็ได้ แต่ client ส่งมักเป็น string
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
    const jobs: Job[] = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// ดึงงานตาม ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const job: Job | null = await prisma.job.findUnique({
      where: { job_id: parseInt(id) },
    });
    if (!job) return res.status(404).json({ error: "ไม่พบงานนี้" });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// เพิ่มงาน
router.post("/", async (req: Request<{}, {}, CreateJobBody>, res: Response) => {
  try {
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
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลงาน" });
  }
});

export default router;
