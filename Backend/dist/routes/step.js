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
function parsePriority(value) {
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        return null;
    }
    return parsedValue;
}
//ดึง Step ทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const steps = yield prisma.step.findMany();
        res.json(steps.sort((left, right) => {
            if (left.priority !== right.priority) {
                return left.priority - right.priority;
            }
            return left.step_id - right.step_id;
        }));
    }
    catch (error) {
        console.error("Error fetching Steps:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
    }
}));
// ดึง Step ตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const step = yield prisma.step.findUnique({
            where: { step_id: parseInt(id, 10) },
        });
        if (!step) {
            return res.status(404).json({ error: "ไม่พบ Step นี้" });
        }
        res.json(step);
    }
    catch (error) {
        console.error("Error fetching Step:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
    }
}));
// เพิ่ม Step
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { step_name, standard_time, priority } = req.body;
    const parsedPriority = parsePriority(priority !== null && priority !== void 0 ? priority : 1);
    if (!step_name || !standard_time) {
        return res.status(400).json({
            error: "กรุณากรอกชื่อ Step และกำลังการผลิตสูงสุดต่อวัน"
        });
    }
    if (parsedPriority === null) {
        return res.status(400).json({ error: "priority ต้องเป็นจำนวนเต็มบวก" });
    }
    try {
        const newStep = yield prisma.step.create({
            data: { step_name, standard_time, priority: parsedPriority },
        });
        res.status(201).json(newStep);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Step ชื่อนี้มีอยู่แล้วในระบบ" });
        }
        console.error("Error creating Step:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล Step" });
    }
}));
// แก้ไข Step
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { step_name, standard_time, priority } = req.body;
    const parsedPriority = parsePriority(priority !== null && priority !== void 0 ? priority : 1);
    if (!step_name || !standard_time) {
        return res.status(400).json({
            error: "กรุณากรอกชื่อ Step และกำลังการผลิตสูงสุดต่อวัน"
        });
    }
    if (parsedPriority === null) {
        return res.status(400).json({ error: "priority ต้องเป็นจำนวนเต็มบวก" });
    }
    try {
        const existingStep = yield prisma.step.findUnique({
            where: { step_id: parseInt(id, 10) },
        });
        if (!existingStep) {
            return res.status(404).json({ error: "ไม่พบ Step นี้" });
        }
        const updatedStep = yield prisma.step.update({
            where: { step_id: parseInt(id, 10) },
            data: { step_name, standard_time, priority: parsedPriority },
        });
        res.json(updatedStep);
    }
    catch (error) {
        console.error("Error updating Step:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล Step" });
    }
}));
// ลบ Step
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const stepId = parseInt(id, 10);
    try {
        const existingStep = yield prisma.step.findUnique({
            where: { step_id: stepId },
        });
        if (!existingStep) {
            return res.status(404).json({ error: "ไม่พบ Step นี้" });
        }
        // ตรวจสอบการใช้งาน Step ใน JobStep
        const relatedJobSteps = yield prisma.jobStep.findMany({
            where: { step_id: stepId },
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
                productionLogs: {
                    include: {
                        employee: {
                            select: {
                                fullname: true
                            }
                        }
                    }
                }
            }
        });
        if (relatedJobSteps.length > 0) {
            // แยกระหว่าง jobs ที่มี production logs และไม่มี
            const jobsWithLogs = [];
            const jobsWithoutLogs = [];
            relatedJobSteps.forEach(jobStep => {
                const jobInfo = `${jobStep.job.job_number} (${jobStep.job.customer.fullname})`;
                if (jobStep.productionLogs.length > 0) {
                    const logInfo = jobStep.productionLogs.map(log => `บันทึกวันที่ ${new Date(log.log_date).toLocaleDateString('th-TH')} จำนวน ${log.quantity} ชิ้น`).join(", ");
                    jobsWithLogs.push(`${jobInfo} - ${logInfo}`);
                }
                else {
                    jobsWithoutLogs.push(jobInfo);
                }
            });
            let errorMessage = `ไม่สามารถลบ Step "${existingStep.step_name}" ได้ เนื่องจากกำลังถูกใช้งานในงาน`;
            if (jobsWithLogs.length > 0) {
                errorMessage += `\n\nงานที่มีบันทึกการผลิต:\n${jobsWithLogs.join('\n')}`;
            }
            if (jobsWithoutLogs.length > 0) {
                errorMessage += `\n\nงานที่ยังไม่มีบันทึกการผลิต:\n${jobsWithoutLogs.join(', ')}`;
            }
            return res.status(400).json({
                error: errorMessage,
                hasProductionLogs: jobsWithLogs.length > 0,
                jobsWithLogs: jobsWithLogs.length,
                jobsWithoutLogs: jobsWithoutLogs.length,
                totalJobs: relatedJobSteps.length
            });
        }
        // ถ้าไม่มีการใช้งาน ให้ลบได้
        yield prisma.step.delete({
            where: { step_id: stepId },
        });
        res.json({ message: `ลบ Step "${existingStep.step_name}" เรียบร้อยแล้ว` });
    }
    catch (error) {
        console.error("Error deleting Step:", error);
        // จัดการ Foreign key constraint error
        if (error.code === "P2003") {
            return res.status(400).json({
                error: `ไม่สามารถลบ Step นี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่`
            });
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล Step" });
    }
}));
// เพิ่ม endpoint สำหรับตรวจสอบการใช้งาน step ใน job
router.get("/:id/usage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const stepId = parseInt(id, 10);
    try {
        const step = yield prisma.step.findUnique({
            where: { step_id: stepId },
        });
        if (!step) {
            return res.status(404).json({ error: "ไม่พบ Step นี้" });
        }
        // หาการใช้งานใน JobStep
        const relatedJobSteps = yield prisma.jobStep.findMany({
            where: { step_id: stepId },
            include: {
                job: {
                    select: {
                        job_id: true,
                        job_number: true,
                        customer: {
                            select: {
                                fullname: true
                            }
                        }
                    }
                },
                productionLogs: {
                    include: {
                        employee: {
                            select: {
                                fullname: true
                            }
                        }
                    }
                }
            }
        });
        const usage = relatedJobSteps.map(jobStep => ({
            job_id: jobStep.job.job_id,
            job_number: jobStep.job.job_number,
            customer_name: jobStep.job.customer.fullname,
            has_production_logs: jobStep.productionLogs.length > 0,
            production_logs_count: jobStep.productionLogs.length,
            production_logs: jobStep.productionLogs.map(log => ({
                log_date: log.log_date,
                quantity: log.quantity,
                employee_name: log.employee.fullname
            }))
        }));
        res.json({
            step_id: stepId,
            step_name: step.step_name,
            priority: step.priority,
            is_used: usage.length > 0,
            total_jobs: usage.length,
            jobs_with_logs: usage.filter(u => u.has_production_logs).length,
            usage: usage
        });
    }
    catch (error) {
        console.error("Error checking step usage:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบการใช้งาน Step" });
    }
}));
exports.default = router;
