import express, { Request, Response } from "express";
import { PrismaClient, Shipment } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


// ================== GET ALL ==================
router.get("/", async (_req: Request, res: Response) => {
  try {
    const shipments: Shipment[] = await prisma.shipment.findMany({
      include: {
        transportType: true,
        status: true,
        shipmentItems: true,
      },
    });

    res.json(shipments);
  } catch (error: any) {
    console.error("Error fetching Shipment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Shipment" });
  }
});


// ================== GET BY ID ==================
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const shipment = await prisma.shipment.findUnique({
      where: { shipment_id: id },
      include: {
        transportType: true,
        status: true,
        shipmentItems: true,
      },
    });

    if (!shipment) {
      return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
    }

    res.json(shipment);
  } catch (error: any) {
    console.error("Error fetching Shipment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Shipment" });
  }
});


// ================== CREATE ==================
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      job_id,
      transport_type_id,
      status_id,
      departure_date,
      arrival_date,
      note,
    } = req.body;

    const shipment: Shipment = await prisma.shipment.create({
      data: {
        job_id,
        transport_type_id,
        status_id,
        departure_date: new Date(departure_date),
        arrival_date: new Date(arrival_date),
        note,
      },
    });

    res.status(201).json(shipment);
  } catch (error: any) {
    console.error("Error creating Shipment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่ม Shipment" });
  }
});


// ================== UPDATE ==================
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const existingShipment = await prisma.shipment.findUnique({
      where: { shipment_id: id },
    });

    if (!existingShipment) {
      return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
    }

    const updatedShipment = await prisma.shipment.update({
      where: { shipment_id: id },
      data: {
        ...req.body,
        departure_date: new Date(req.body.departure_date),
        arrival_date: new Date(req.body.arrival_date),
      },
    });

    res.json(updatedShipment);
  } catch (error: any) {
    console.error("Error updating Shipment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไข Shipment" });
  }
});


// ================== DELETE ==================
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const existingShipment = await prisma.shipment.findUnique({
      where: { shipment_id: id },
    });

    if (!existingShipment) {
      return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
    }

    await prisma.shipment.delete({
      where: { shipment_id: id },
    });

    res.json({ message: "ลบ Shipment เรียบร้อยแล้ว" });
  } catch (error: any) {
    console.error("Error deleting Shipment:", error);

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "ไม่สามารถลบ Shipment นี้ได้ เนื่องจากมี ShipmentItem เชื่อมโยงอยู่",
      });
    }

    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ Shipment" });
  }
});


export default router;
