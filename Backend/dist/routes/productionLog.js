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
//ดึงทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield prisma.productionLog.findMany({
            include: {
                job: {
                    include: {
                        customer: true,
                    }
                },
                jobStep: {
                    include: {
                        job: true,
                        step: true,
                    }
                },
                employee: true,
            },
        });
        res.json(logs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
    }
}));
//ดึงตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const log = yield prisma.productionLog.findUnique({
            where: { log_id: parseInt(req.params.id, 10) },
            include: { job: true, jobStep: true, employee: true },
        });
        if (!log)
            return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });
        res.json(log);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
    }
}));
//เพิ่ม ProductionLog
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { job_step_id, log_date, quantity, employee_id } = req.body;
    if (!job_step_id || !log_date || !quantity || !employee_id) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }
    try {
        //หา job_id จาก job_step_id
        const jobStep = yield prisma.jobStep.findUnique({
            where: { job_step_id },
            include: { job: true },
        });
        if (!jobStep || !jobStep.job) {
            return res.status(404).json({ error: "ไม่พบ Job หรือ JobStep ที่เลือก" });
        }
        //ดึง end_date จาก Job
        const endDate = jobStep.job.end_date;
        const newLog = yield prisma.productionLog.create({
            data: {
                job_id: jobStep.job_id,
                job_step_id,
                log_date: new Date(log_date),
                quantity,
                employee_id,
                dateline_date: endDate, // ใช้ชื่อฟิลด์ให้ตรงกับ model
            },
        });
        res.status(201).json(newLog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "เกิดข้อผิดพลาดในการเพิ่ม ProductionLog",
            details: error.message,
        });
    }
}));
//แก้ไข ProductionLog
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { job_step_id, log_date, quantity, employee_id } = req.body;
    if (!job_step_id || !log_date || !quantity || !employee_id) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }
    try {
        const logId = parseInt(req.params.id, 10);
        const existingLog = yield prisma.productionLog.findUnique({ where: { log_id: logId } });
        if (!existingLog)
            return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });
        //หา job_id และ end_date ใหม่จาก jobStep
        const jobStep = yield prisma.jobStep.findUnique({
            where: { job_step_id },
            include: { job: true },
        });
        if (!jobStep || !jobStep.job) {
            return res.status(404).json({ error: "ไม่พบ Job หรือ JobStep ที่เลือก" });
        }
        const updatedLog = yield prisma.productionLog.update({
            where: { log_id: logId },
            data: {
                job_id: jobStep.job_id,
                job_step_id,
                log_date: new Date(log_date),
                quantity,
                employee_id,
                dateline_date: jobStep.job.end_date, //แก้ชื่อฟิลด์ให้ตรง
            },
        });
        res.json(updatedLog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "เกิดข้อผิดพลาดในการแก้ไข ProductionLog",
            details: error.message,
        });
    }
}));
//ลบ ProductionLog
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logId = parseInt(req.params.id, 10);
        const existingLog = yield prisma.productionLog.findUnique({ where: { log_id: logId } });
        if (!existingLog)
            return res.status(404).json({ error: "ไม่พบ ProductionLog นี้" });
        yield prisma.productionLog.delete({ where: { log_id: logId } });
        res.json({ message: "ลบ ProductionLog เรียบร้อยแล้ว" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบ ProductionLog" });
    }
}));
exports.default = router;
