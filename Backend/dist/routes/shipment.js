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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const shipmentStatusUpdater_1 = require("../utils/shipmentStatusUpdater");
const generateShipmentNumber_1 = require("../utils/generateShipmentNumber");
const updateShipmentStatus_1 = require("../utils/updateShipmentStatus");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const parseOptionalDate = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return new Date(String(value));
};
const getJobShipmentCapacity = (jobId, excludeShipmentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const job = yield prisma.job.findUnique({
        where: { job_id: jobId },
        select: { job_id: true, total_quantity: true, job_number: true },
    });
    if (!job) {
        return null;
    }
    const shipmentAggregate = yield prisma.shipment.aggregate({
        where: Object.assign({ job_id: jobId }, (excludeShipmentId ? { shipment_id: { not: excludeShipmentId } } : {})),
        _sum: {
            total_quantity: true,
        },
    });
    const shippedQuantity = (_a = shipmentAggregate._sum.total_quantity) !== null && _a !== void 0 ? _a : 0;
    return {
        job,
        shippedQuantity,
        remainingQuantity: Math.max(job.total_quantity - shippedQuantity, 0),
    };
});
// ================== GET ALL ==================
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shipments = yield prisma.shipment.findMany({
        include: {
            transportType: true,
            status: true,
            customer: true,
            job: true,
            shipmentItems: true,
        },
    });
    const result = shipments.map((s) => (Object.assign(Object.assign({}, s), { calculated_status: (0, shipmentStatusUpdater_1.calculateShipmentStatus)(s.departure_date, s.arrival_date, s.actual_delivery_date) })));
    res.json(result);
}));
// ================== SEARCH ==================
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    const shipments = yield prisma.shipment.findMany({
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
            status: true,
            customer: true,
            job: true,
            shipmentItems: true,
        },
    });
    const result = shipments.map((s) => (Object.assign(Object.assign({}, s), { calculated_status: (0, shipmentStatusUpdater_1.calculateShipmentStatus)(s.departure_date, s.arrival_date, s.actual_delivery_date) })));
    res.json(result);
}));
// ================== GET BY ID ==================
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const shipment = yield prisma.shipment.findUnique({
            where: { shipment_id: id },
            include: {
                transportType: true,
                status: true,
                customer: true,
                job: true,
                shipmentItems: true,
            },
        });
        if (!shipment) {
            return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
        }
        const typedShipment = shipment;
        const result = Object.assign(Object.assign({}, typedShipment), { calculated_status: (0, shipmentStatusUpdater_1.calculateShipmentStatus)(typedShipment.departure_date, typedShipment.arrival_date, typedShipment.actual_delivery_date) });
        res.json(result);
    }
    catch (error) {
        console.error("Error fetching shipment:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Shipment" });
    }
}));
// ================== CREATE ==================
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, job_id, transport_type_id, status_id, departure_date, arrival_date, actual_delivery_date, note, total_quantity, } = req.body;
        const parsedDepartureDate = new Date(departure_date);
        const parsedArrivalDate = new Date(arrival_date);
        const parsedActualDeliveryDate = parseOptionalDate(actual_delivery_date);
        const parsedTotalQuantity = total_quantity ? parseInt(total_quantity, 10) : 0;
        if (!Number.isFinite(parsedTotalQuantity) || parsedTotalQuantity <= 0) {
            return res.status(400).json({
                error: "จำนวนที่จัดส่งต้องมากกว่า 0",
            });
        }
        if (parsedActualDeliveryDate && parsedActualDeliveryDate < parsedDepartureDate) {
            return res.status(400).json({
                error: "วันที่จัดส่งสำเร็จจริงต้องไม่น้อยกว่าวันที่ออกเดินทาง",
            });
        }
        const shipmentCapacity = yield getJobShipmentCapacity(Number(job_id));
        if (!shipmentCapacity) {
            return res.status(404).json({
                error: "ไม่พบงานที่อ้างอิงสำหรับการจัดส่งนี้",
            });
        }
        if (parsedTotalQuantity > shipmentCapacity.remainingQuantity) {
            return res.status(400).json({
                error: `จำนวนที่จัดส่งเกินจำนวนคงเหลือของงาน ${shipmentCapacity.job.job_number} เหลือส่งได้อีก ${shipmentCapacity.remainingQuantity} ชิ้น จากทั้งหมด ${shipmentCapacity.job.total_quantity} ชิ้น`,
                remaining_quantity: shipmentCapacity.remainingQuantity,
                shipped_quantity: shipmentCapacity.shippedQuantity,
                job_total_quantity: shipmentCapacity.job.total_quantity,
            });
        }
        const shipment_numbar = yield (0, generateShipmentNumber_1.generateShipmentNumber)();
        const shipment = yield prisma.shipment.create({
            data: {
                shipment_numbar,
                customer_id,
                job_id,
                transport_type_id,
                status_id,
                departure_date: parsedDepartureDate,
                arrival_date: parsedArrivalDate,
                actual_delivery_date: parsedActualDeliveryDate,
                note,
                total_quantity: parsedTotalQuantity,
            },
        });
        // อัปเดตสถานะของ shipment ทั้งหมดหลังจากสร้างใหม่
        yield (0, updateShipmentStatus_1.updateAllShipmentStatuses)();
        res.status(201).json(shipment);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "เกิดเลข Shipment ซ้ำ กรุณาลองใหม่",
            });
        }
        res.status(500).json({
            error: "เกิดข้อผิดพลาดในการเพิ่ม Shipment",
        });
    }
}));
// ================== UPDATE ==================
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id);
    try {
        const existingShipment = yield prisma.shipment.findUnique({
            where: { shipment_id: id },
        });
        if (!existingShipment) {
            return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
        }
        const parsedDepartureDate = req.body.departure_date
            ? new Date(req.body.departure_date)
            : undefined;
        const parsedArrivalDate = req.body.arrival_date
            ? new Date(req.body.arrival_date)
            : undefined;
        const parsedActualDeliveryDate = Object.prototype.hasOwnProperty.call(req.body, "actual_delivery_date")
            ? parseOptionalDate(req.body.actual_delivery_date)
            : undefined;
        const parsedTotalQuantity = Object.prototype.hasOwnProperty.call(req.body, "total_quantity")
            ? parseInt(req.body.total_quantity, 10)
            : undefined;
        const targetJobId = (_a = req.body.job_id) !== null && _a !== void 0 ? _a : existingShipment.job_id;
        if (parsedDepartureDate && parsedActualDeliveryDate && parsedActualDeliveryDate < parsedDepartureDate) {
            return res.status(400).json({
                error: "วันที่จัดส่งสำเร็จจริงต้องไม่น้อยกว่าวันที่ออกเดินทาง",
            });
        }
        if (parsedTotalQuantity !== undefined && (!Number.isFinite(parsedTotalQuantity) || parsedTotalQuantity <= 0)) {
            return res.status(400).json({
                error: "จำนวนที่จัดส่งต้องมากกว่า 0",
            });
        }
        if (parsedTotalQuantity !== undefined || req.body.job_id !== undefined) {
            const shipmentCapacity = yield getJobShipmentCapacity(Number(targetJobId), id);
            if (!shipmentCapacity) {
                return res.status(404).json({
                    error: "ไม่พบงานที่อ้างอิงสำหรับการจัดส่งนี้",
                });
            }
            const requestedQuantity = parsedTotalQuantity !== null && parsedTotalQuantity !== void 0 ? parsedTotalQuantity : existingShipment.total_quantity;
            if (requestedQuantity > shipmentCapacity.remainingQuantity) {
                return res.status(400).json({
                    error: `จำนวนที่จัดส่งเกินจำนวนคงเหลือของงาน ${shipmentCapacity.job.job_number} เหลือส่งได้อีก ${shipmentCapacity.remainingQuantity} ชิ้น จากทั้งหมด ${shipmentCapacity.job.total_quantity} ชิ้น`,
                    remaining_quantity: shipmentCapacity.remainingQuantity,
                    shipped_quantity: shipmentCapacity.shippedQuantity,
                    job_total_quantity: shipmentCapacity.job.total_quantity,
                });
            }
        }
        const updatedShipment = yield prisma.shipment.update({
            where: { shipment_id: id },
            data: {
                shipment_numbar: req.body.shipment_numbar,
                customer_id: req.body.customer_id,
                job_id: req.body.job_id,
                transport_type_id: req.body.transport_type_id,
                status_id: req.body.status_id,
                departure_date: parsedDepartureDate,
                arrival_date: parsedArrivalDate,
                actual_delivery_date: parsedActualDeliveryDate,
                note: req.body.note,
                total_quantity: parsedTotalQuantity,
            },
        });
        yield (0, updateShipmentStatus_1.updateAllShipmentStatuses)();
        res.json(updatedShipment);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "shipment_numbar นี้มีอยู่แล้ว",
            });
        }
        res.status(500).json({
            error: "เกิดข้อผิดพลาดในการแก้ไข Shipment",
        });
    }
}));
// ================== DELETE ==================
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const existingShipment = yield prisma.shipment.findUnique({
            where: { shipment_id: id },
        });
        if (!existingShipment) {
            return res.status(404).json({ error: "ไม่พบ Shipment นี้" });
        }
        yield prisma.shipment.delete({
            where: { shipment_id: id },
        });
        res.json({ message: "ลบ Shipment เรียบร้อยแล้ว" });
    }
    catch (error) {
        console.error("Error deleting Shipment:", error);
        if (error.code === "P2003") {
            return res.status(400).json({
                error: "ไม่สามารถลบ Shipment นี้ได้ เนื่องจากมี ShipmentItem เชื่อมโยงอยู่",
            });
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ Shipment" });
    }
}));
exports.default = router;
