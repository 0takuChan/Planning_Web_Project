import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateShipmentStatusAutomatically = async () => {
  const today = new Date();

  const shipments = await prisma.shipment.findMany();

  for (const s of shipments) {
    let newStatus = 1;

    if (today >= s.arrival_date) {
      newStatus = 3;
    } else if (today >= s.departure_date) {
      newStatus = 2;
    }

    if (newStatus !== s.status_id) {
      await prisma.shipment.update({
        where: { shipment_id: s.shipment_id },
        data: { status_id: newStatus },
      });
    }
  }
};
