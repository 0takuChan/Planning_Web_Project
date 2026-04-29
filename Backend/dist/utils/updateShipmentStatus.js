"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllShipmentStatuses = updateAllShipmentStatuses;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * อัปเดตสถานะของ shipment โดยอ้างอิงจากวันปัจจุบัน
 * - ถ้า departure_date > วันปัจจุบัน → "เตรียมส่ง"
 * - ถ้า departure_date <= วันปัจจุบัน && arrival_date > วันปัจจุบัน → "กำลังส่ง"
 * - ถ้ามี actual_delivery_date → "ส่งแล้ว"
 * - ถ้า arrival_date <= วันปัจจุบัน → "จัดส่งสำเสร็จ"
 */
function updateAllShipmentStatuses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to midnight for fair date comparison
            // ดึงสถานะทั้งหมด
            const statuses = yield prisma.shipmentStatus.findMany();
            const statusMap = new Map(statuses.map((s) => [s.status_name, s.status_id]));
            // ดึง shipment ทั้งหมด
            const shipments = yield prisma.shipment.findMany();
            let updatedCount = 0;
            for (const shipment of shipments) {
                const departureDate = new Date(shipment.departure_date);
                const arrivalDate = new Date(shipment.arrival_date);
                const actualDeliveryDate = shipment.actual_delivery_date
                    ? new Date(shipment.actual_delivery_date)
                    : null;
                departureDate.setHours(0, 0, 0, 0);
                arrivalDate.setHours(0, 0, 0, 0);
                actualDeliveryDate === null || actualDeliveryDate === void 0 ? void 0 : actualDeliveryDate.setHours(0, 0, 0, 0);
                let newStatusId = null;
                // ตรวจสอบสภาวะและกำหนดสถานะ
                if (actualDeliveryDate) {
                    newStatusId = statusMap.get("ส่งแล้ว") || null;
                }
                else if (departureDate > today) {
                    // ยังไม่ถึงวันออกเดินทาง → เตรียมส่ง
                    newStatusId = statusMap.get("เตรียมส่ง") || null;
                }
                else if (departureDate <= today && arrivalDate > today) {
                    // ออกเดินทางแล้วแต่ยังไม่ถึง → กำลังจัดส่ง
                    newStatusId = statusMap.get("กำลังจัดส่ง") || null;
                }
                else if (arrivalDate <= today) {
                    // ถึงวันจัดส่งแล้ว → ส่งแล้ว
                    newStatusId = statusMap.get("ส่งแล้ว") || null;
                }
                // อัปเดตถ้ามีสถานะใหม่
                if (newStatusId && newStatusId !== shipment.status_id) {
                    yield prisma.shipment.update({
                        where: { shipment_id: shipment.shipment_id },
                        data: { status_id: newStatusId },
                    });
                    updatedCount++;
                    console.log(`[Shipment ${shipment.shipment_id}] Status updated to ID: ${newStatusId}`);
                }
            }
            console.log(`[${new Date().toISOString()}] Shipment status update completed. ${updatedCount} shipments updated.`);
            return { success: true, updatedCount };
        }
        catch (error) {
            console.error("Error updating shipment statuses:", error);
            return { success: false, error };
        }
    });
}
