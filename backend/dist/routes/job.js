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
// ดึงงานทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield prisma.job.findMany();
        res.json(jobs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
    }
}));
// ดึงงานตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const job = yield prisma.job.findUnique({
            where: { job_id: parseInt(id) },
        });
        if (!job)
            return res.status(404).json({ error: "ไม่พบงานนี้" });
        res.json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
    }
}));
// เพิ่มงาน
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { job_number, created_date, end_date, customer_id, total_quantity, clothing_type, type_of_fabric, employee_id, delivery_location, } = req.body;
        const newJob = yield prisma.job.create({
            data: {
                job_number,
                created_date: new Date(created_date),
                end_date: new Date(end_date),
                customer_id,
                total_quantity,
                clothing_type,
                type_of_fabric,
                employee_id,
                delivery_location,
            },
        });
        res.status(201).json(newJob);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลงาน" });
    }
}));
exports.default = router;
