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
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// ดึง ProductionLog ทั้งหมด
router.get("/get/productionlogs", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield prisma.productionLog.findMany({
            include: { job: true, jobStep: true, employee: true },
        });
        res.json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
    }
}));
// เพิ่ม ProductionLog
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { job_id, job_step_id, log_date, actual_date, quantity, employee_id } = req.body;
    if (!job_id || !job_step_id || !log_date || !actual_date || !quantity || !employee_id) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const newLog = yield prisma.productionLog.create({
            data: {
                job_id,
                job_step_id,
                log_date: new Date(log_date),
                actual_date: new Date(actual_date),
                quantity,
                employee_id,
            },
        });
        res.json(newLog);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res
                .status(400)
                .json({ error: "ProductionLog with this job_id and job_step_id already exists" });
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
    }
}));
exports.default = router;
