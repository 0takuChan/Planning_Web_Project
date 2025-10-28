import express, { Request, Response } from "express";
import { PrismaClient, Planning } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Interface สำหรับ request body ตอนเพิ่มหรือแก้ไข Planning
interface CreatePlanningBody {
  job_id: number;
  job_step_id: number;
  planned_date: string;
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
      include: { job: true, jobStep: true },
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

// // เพิ่ม Planning
// router.post("/", async (req: Request<{}, {}, CreatePlanningBody>, res: Response) => {
//   const { job_id, job_step_id, planned_date, planned_quantity } = req.body;

//   if (!job_id || !job_step_id || !planned_date || planned_quantity === undefined) {
//     return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
//   }

//   try {
//     const job = await prisma.job.findUnique({ where: { job_id } });
//     if (!job) return res.status(404).json({ error: "ไม่พบงานนี้" });

//     // ตรวจสอบว่ามี Planning ของ job_id + job_step_id + วันเดียวกัน
//     const existingSameDay = await prisma.planning.findFirst({
//       where: { job_id, job_step_id, planned_date: new Date(planned_date) },
//     });

//     // รวม planned_quantity ของ job_id + job_step_id ทั้งหมด
//     const allPlanned = await prisma.planning.aggregate({
//       where: { job_id, job_step_id },
//       _sum: { planned_quantity: true },
//     });

//     const currentPlanned = existingSameDay ? existingSameDay.planned_quantity : 0;
//     const newTotal = (allPlanned._sum.planned_quantity || 0) - currentPlanned + planned_quantity;

//     if (newTotal > job.total_quantity) {
//       return res.status(400).json({
//         error: `จำนวนสินค้ารวมของหัวข้อนี้ (${newTotal}) เกินจำนวนทั้งหมดของ Job (${job.total_quantity})`,
//       });
//     }

//     let planning;
//     if (existingSameDay) {
//       // รวม planned_quantity กับวันเดิม
//       planning = await prisma.planning.update({
//         where: { planning_id: existingSameDay.planning_id },
//         data: { planned_quantity: existingSameDay.planned_quantity + planned_quantity },
//       });
//     } else {
//       // สร้างใหม่
//       planning = await prisma.planning.create({
//         data: {
//           job_id,
//           job_step_id,
//           planned_date: new Date(planned_date),
//           planned_quantity,
//         },
//       });
//     }

//     res.status(201).json(planning);
//   } catch (error: any) {
//     console.error("Error creating planning:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล Planning" });
//   }
// });

// // แก้ไข Planning
// router.put("/:id", async (req: Request<{ id: string }, {}, CreatePlanningBody>, res: Response) => {
//   const { id } = req.params;
//   const { job_id, job_step_id, planned_date, planned_quantity } = req.body;

//   if (!job_id || !job_step_id || !planned_date || planned_quantity === undefined) {
//     return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
//   }

//   try {
//     const existingPlanning = await prisma.planning.findUnique({
//       where: { planning_id: parseInt(id, 10) },
//     });

//     if (!existingPlanning) return res.status(404).json({ error: "ไม่พบข้อมูล Planning นี้" });

//     const job = await prisma.job.findUnique({ where: { job_id } });
//     if (!job) return res.status(404).json({ error: "ไม่พบงานนี้" });

//     // รวม planned_quantity ของ job_id + job_step_id (หัวข้อใหม่) ทั้งหมด ยกเว้นตัวเอง
//     const allPlanned = await prisma.planning.aggregate({
//       where: {
//         job_id,
//         job_step_id,
//         NOT: { planning_id: existingPlanning.planning_id },
//       },
//       _sum: { planned_quantity: true },
//     });

//     const newTotal = (allPlanned._sum.planned_quantity || 0) + planned_quantity;

//     if (newTotal > job.total_quantity) {
//       return res.status(400).json({
//         error: `จำนวนสินค้ารวมของหัวข้อนี้ (${newTotal}) เกินจำนวนทั้งหมดของ Job (${job.total_quantity})`,
//       });
//     }

//     // อัปเดตข้อมูล สามารถเปลี่ยน job_step_id และวันที่ได้
//     const updatedPlanning = await prisma.planning.update({
//       where: { planning_id: existingPlanning.planning_id },
//       data: {
//         job_id,
//         job_step_id,
//         planned_date: new Date(planned_date),
//         planned_quantity,
//       },
//     });

//     res.json(updatedPlanning);
//   } catch (error: any) {
//     console.error("Error updating planning:", error);
//     res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล Planning" });
//   }
// });

// ลบ Planning
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    // ตรวจสอบว่ามีอยู่จริงไหม
    const existingPlanning = await prisma.planning.findUnique({
      where: { planning_id: parseInt(id, 10) },
    });

    if (!existingPlanning) {
      return res.status(404).json({ error: "ไม่พบข้อมูล Planning นี้" });
    }

    // ลบข้อมูล
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
