import express, { Request, Response } from "express";
import { PrismaClient, Step } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่ม/แก้ไข Step
interface CreateStepBody {
  step_name: string;
}

//ดึง Step ทั้งหมด
router.get("/", async (_req: Request, res: Response) => {
  try {
    const steps: Step[] = await prisma.step.findMany();
    res.json(steps);
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
  const { step_name } = req.body;

  if (!step_name) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ Step" });
  }

  try {
    const newStep: Step = await prisma.step.create({
      data: { step_name },
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
  const { step_name } = req.body;

  if (!step_name) {
    return res.status(400).json({ error: "กรุณากรอกชื่อ Step" });
  }

  try {
    const existingStep = await prisma.step.findUnique({
      where: { step_id: parseInt(id, 10) },
    });

    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    const updatedStep = await prisma.step.update({
      where: { step_id: parseInt(id, 10) },
      data: { step_name },
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

  try {
    const existingStep = await prisma.step.findUnique({
      where: { step_id: parseInt(id, 10) },
    });

    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบ Step นี้" });
    }

    await prisma.step.delete({
      where: { step_id: parseInt(id, 10) },
    });

    res.json({ message: "ลบข้อมูล Step เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error deleting Step:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล Step" });
  }
});

export default router;
