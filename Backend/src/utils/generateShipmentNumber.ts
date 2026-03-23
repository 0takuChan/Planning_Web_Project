import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateShipmentNumber = async () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  const baseTime = `${day}${month}${year}${hour}${minute}${second}`;

  // หา shipment ที่ถูกสร้างในวินาทีเดียวกัน
  const existingCount = await prisma.shipment.count({
    where: {
      shipment_numbar: {
        startsWith: `SM${baseTime}`,
      },
    },
  });

  const runningNumber = existingCount + 1;

  return `SM${baseTime}${runningNumber}TH`;
};
