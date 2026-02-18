import express, { Request, Response } from "express";
import { PrismaClient, Shipment } from "@prisma/client";
import { calculateShipmentStatus } from "../utils/shipmentStatusUpdater";
import { generateShipmentNumber } from "../utils/generateShipmentNumber";



const router = express.Router();
const prisma = new PrismaClient();


// ================== GET ALL ==================
router.get("/", async (_req: Request, res: Response) => {
  const shipments = await prisma.shipment.findMany({
    include: {
      transportType: true,
    },
  });

  const result = shipments.map((s) => ({
    ...s,
    calculated_status: calculateShipmentStatus(
      s.departure_date,
      s.arrival_date
    ),
  }));

  res.json(result);
});


// ================== GET BY ID ==================
router.get("/", async (req: Request, res: Response) => {

  const search = req.query.search as string;

  const shipments = await prisma.shipment.findMany({
    where: search
      ? {
          shipment_numbar: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {},
    include: {
      transportType: true,
    },
  });

  const result = shipments.map((s) => ({
    ...s,
    calculated_status: calculateShipmentStatus(
      s.departure_date,
      s.arrival_date
    ),
  }));

  res.json(result);
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

    const shipment_numbar = await generateShipmentNumber();

    const shipment = await prisma.shipment.create({
      data: {
        shipment_numbar,
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

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "เกิดเลข Shipment ซ้ำ กรุณาลองใหม่",
      });
    }

    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการเพิ่ม Shipment",
    });
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
        shipment_numbar: req.body.shipment_numbar,
        job_id: req.body.job_id,
        transport_type_id: req.body.transport_type_id,
        status_id: req.body.status_id,
        departure_date: new Date(req.body.departure_date),
        arrival_date: new Date(req.body.arrival_date),
        note: req.body.note,
      },
    });

    res.json(updatedShipment);
  } catch (error: any) {

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "shipment_numbar นี้มีอยู่แล้ว",
      });
    }

    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการแก้ไข Shipment",
    });
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
