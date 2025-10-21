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
// ดึงขั้นตอนงานทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobsteps = yield prisma.jobStep.findMany({
            include: { job: true, step: true },
        });
        res.json(jobsteps);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
    }
}));
// เพิ่ม JobStep
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { job_id, step_id } = req.body;
    if (!job_id || !step_id) {
        return res.status(400).json({ error: "job_id and step_id are required" });
    }
    try {
        const newJobStep = yield prisma.jobStep.create({
            data: {
                job_id,
                step_id,
            },
        });
        res.json(newJobStep);
    }
    catch (error) {
        // ตรวจสอบ Prisma unique constraint violation
        if (error.code === "P2002") {
            return res
                .status(400)
                .json({ error: "JobStep with this job_id and step_id already exists" });
        }
        res.status(500).json({ error: "เกิดข้อผิดพลาด", details: error.message });
    }
}));
exports.default = router;
