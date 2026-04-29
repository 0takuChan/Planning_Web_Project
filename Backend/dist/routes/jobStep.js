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
const parseMinutesPerUnit = (value) => {
    if (value === undefined || value === null || value === "") {
        return null;
    }
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return Number.NaN;
    }
    return Math.trunc(parsedValue);
};
// ดึง JobStep ทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobsteps = yield prisma.jobStep.findMany({
            include: { job: true, step: true },
        });
        res.json(jobsteps);
    }
    catch (error) {
        console.error("Error fetching JobSteps:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
    }
}));
// ดึง JobStep ตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jobstep = yield prisma.jobStep.findUnique({
            where: { job_step_id: parseInt(id, 10) },
            include: { job: true, step: true },
        });
        if (!jobstep) {
            return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
        }
        res.json(jobstep);
    }
    catch (error) {
        console.error("Error fetching JobStep:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
    }
}));
// เพิ่ม JobStep
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { job_id, step_id, minutes_per_unit } = req.body;
    const parsedMinutesPerUnit = parseMinutesPerUnit(minutes_per_unit);
    if (!job_id || !step_id) {
        return res.status(400).json({ error: "กรุณากรอก job_id และ step_id" });
    }
    if (Number.isNaN(parsedMinutesPerUnit)) {
        return res.status(400).json({ error: "minutes_per_unit ต้องเป็นตัวเลขจำนวนเต็มที่ไม่ติดลบ" });
    }
    try {
        const createData = {
            job_id,
            step_id,
            minutes_per_unit: parsedMinutesPerUnit,
        };
        const newJobStep = yield prisma.jobStep.create({
            data: createData,
        });
        res.status(201).json(newJobStep);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "JobStep นี้มีอยู่แล้วในระบบ" });
        }
        console.error("Error creating JobStep:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล JobStep" });
    }
}));
// แก้ไข JobStep
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { job_id, step_id, minutes_per_unit } = req.body;
    const parsedMinutesPerUnit = parseMinutesPerUnit(minutes_per_unit);
    if (!job_id || !step_id) {
        return res.status(400).json({ error: "กรุณากรอก job_id และ step_id" });
    }
    if (Number.isNaN(parsedMinutesPerUnit)) {
        return res.status(400).json({ error: "minutes_per_unit ต้องเป็นตัวเลขจำนวนเต็มที่ไม่ติดลบ" });
    }
    try {
        const existingJobStep = yield prisma.jobStep.findUnique({
            where: { job_step_id: parseInt(id, 10) },
        });
        if (!existingJobStep) {
            return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
        }
        const updateData = {
            job_id,
            step_id,
            minutes_per_unit: parsedMinutesPerUnit,
        };
        const updatedJobStep = yield prisma.jobStep.update({
            where: { job_step_id: parseInt(id, 10) },
            data: updateData,
        });
        res.json(updatedJobStep);
    }
    catch (error) {
        console.error("Error updating JobStep:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล JobStep" });
    }
}));
// ลบ JobStep
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const jobStepId = parseInt(id, 10);
    try {
        const existingJobStep = yield prisma.jobStep.findUnique({
            where: { job_step_id: jobStepId },
            include: {
                job: {
                    select: {
                        job_number: true,
                        customer: {
                            select: {
                                fullname: true
                            }
                        }
                    }
                },
                step: {
                    select: {
                        step_name: true
                    }
                }
            }
        });
        if (!existingJobStep) {
            return res.status(404).json({ error: "ไม่พบ JobStep นี้" });
        }
        // ตรวจสอบการใช้งานใน ProductionLog
        const relatedProductionLogs = yield prisma.productionLog.findMany({
            where: { job_step_id: jobStepId },
            include: {
                employee: {
                    select: {
                        fullname: true
                    }
                }
            }
        });
        if (relatedProductionLogs.length > 0) {
            const logDetails = relatedProductionLogs.map(log => `วันที่ ${new Date(log.log_date).toLocaleDateString('th-TH')} จำนวน ${log.quantity} ชิ้น โดย ${log.employee.fullname}`).join(", ");
            return res.status(400).json({
                error: `ไม่สามารถลบ Step "${existingJobStep.step.step_name}" จากงาน "${existingJobStep.job.job_number}" ได้ เนื่องจากมีบันทึกการผลิต: ${logDetails}`,
                hasProductionLogs: true,
                productionLogsCount: relatedProductionLogs.length
            });
        }
        yield prisma.jobStep.delete({
            where: { job_step_id: jobStepId },
        });
        res.json({
            message: `ลบ Step "${existingJobStep.step.step_name}" จากงาน "${existingJobStep.job.job_number}" เรียบร้อยแล้ว`
        });
    }
    catch (error) {
        console.error("Error deleting JobStep:", error);
        if (error.code === "P2003") {
            return res.status(400).json({
                error: "ไม่สามารถลบ JobStep นี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่"
            });
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล JobStep" });
    }
}));
exports.default = router;
