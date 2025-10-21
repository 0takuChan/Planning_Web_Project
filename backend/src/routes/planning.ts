import express, { Request, Response } from "express";
import { PrismaClient, Planning } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม Planning
interface CreatePlanningBody {
  job_id: number;
  job_step_id: number;
  planned_date: string; // client ส่งเป็น string
  planned_quantity: number;
}

// ดึง Planning ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const plannings: Planning[] = await prisma.planning.findMany({
      include: { job: true, jobStep: true },
    });
    res.json(plannings);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Planning" });
  }
});

// เพิ่ม Planning
router.post("/", async (req: Request<{}, {}, CreatePlanningBody>, res: Response) => {
  const { job_id, job_step_id, planned_date, planned_quantity } = req.body;

  if (!job_id || !job_step_id || !planned_date || planned_quantity === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newPlanning: Planning = await prisma.planning.create({
      data: {
        job_id,
        job_step_id,
        planned_date: new Date(planned_date),
        planned_quantity,
      },
    });
    res.json(newPlanning);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Planning with this job_id and job_step_id already exists" });
    }
    res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
  }
});

export default router;
