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
// ดึงลูกค้าทั้งหมด
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany({
            include: {
                _count: {
                    select: {
                        jobs: true, // นับจำนวน jobs ที่เชื่อมโยงกับลูกค้า
                    },
                },
            },
        });
        res.json(customers);
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
    }
}));
// ดึงรายการงานของลูกค้าตาม ID
router.get("/:id/jobs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jobs = yield prisma.job.findMany({
            where: { customer_id: parseInt(id, 10) },
            select: {
                job_id: true,
                job_number: true,
                created_date: true,
                end_date: true,
                clothing_type: true,
                type_of_fabric: true,
            },
            orderBy: { job_id: "desc" },
        });
        res.json(jobs);
    }
    catch (error) {
        console.error("Error fetching customer jobs:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงงานของลูกค้า" });
    }
}));
// ดึงลูกค้าตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const customer = yield prisma.customer.findUnique({
            where: { customer_id: parseInt(id, 10) },
            include: {
                jobs: {
                    select: {
                        job_id: true,
                        job_number: true,
                        created_date: true,
                        end_date: true,
                    },
                },
                _count: {
                    select: {
                        jobs: true,
                    },
                },
            },
        });
        if (!customer) {
            res.status(404).json({ error: "ไม่พบลูกค้านี้" });
            return;
        }
        res.json(customer);
    }
    catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
    }
}));
// เพิ่มลูกค้าใหม่
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, phone, address_detail } = req.body;
        // ดึง customer_code ล่าสุด
        const lastCustomer = yield prisma.customer.findFirst({
            orderBy: { customer_id: "desc" }, // เรียงตาม ID ล่าสุด
        });
        let newCode = "CM-000-0001"; // ค่าเริ่มต้น
        if (lastCustomer && lastCustomer.customer_code) {
            // แยกตัวเลขจาก customer_code ตัวอย่าง: "CM-000-0001"
            const lastNumber = parseInt(lastCustomer.customer_code.replace("CM-", "").replace(/-/g, ""), 10);
            const nextNumber = lastNumber + 1;
            // แปลงกลับเป็น format CM-000-000X
            const nextNumberStr = nextNumber.toString().padStart(7, "0"); // 7 หลัก
            newCode = `CM-${nextNumberStr.slice(0, 3)}-${nextNumberStr.slice(3)}`;
        }
        // สร้างลูกค้าใหม่
        const newCustomer = yield prisma.customer.create({
            data: {
                customer_code: newCode,
                fullname,
                email,
                phone,
                address_detail
            },
            include: {
                _count: {
                    select: {
                        jobs: true,
                    },
                },
            },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า" });
    }
}));
// แก้ไขข้อมูลลูกค้า
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { customer_code, fullname, email, phone, address_detail } = req.body;
    try {
        // ตรวจสอบว่าลูกค้ามีอยู่จริงหรือไม่
        const existingCustomer = yield prisma.customer.findUnique({
            where: { customer_id: parseInt(id, 10) },
        });
        if (!existingCustomer) {
            res.status(404).json({ error: "ไม่พบลูกค้านี้" });
            return;
        }
        // อัปเดตข้อมูล
        const updatedCustomer = yield prisma.customer.update({
            where: { customer_id: parseInt(id, 10) },
            data: { customer_code, fullname, email, phone, address_detail },
            include: {
                _count: {
                    select: {
                        jobs: true,
                    },
                },
            },
        });
        res.json(updatedCustomer);
    }
    catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูลลูกค้า" });
    }
}));
// ลบข้อมูลลูกค้า
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const customerId = parseInt(id, 10);
    try {
        // ตรวจสอบว่ามีลูกค้าจริงไหม
        const existingCustomer = yield prisma.customer.findUnique({
            where: { customer_id: customerId },
            include: {
                _count: {
                    select: {
                        jobs: true, // นับจำนวน jobs ที่เชื่อมโยงกับลูกค้า
                    },
                },
            },
        });
        if (!existingCustomer) {
            res.status(404).json({ error: "ไม่พบลูกค้านี้" });
            return;
        }
        // ตรวจสอบว่ามี Jobs ที่เชื่อมโยงอยู่หรือไม่
        if (existingCustomer._count.jobs > 0) {
            res.status(400).json({
                error: "ไม่สามารถลบลูกค้านี้ได้ เนื่องจากมี Job ที่เชื่อมโยงอยู่",
                details: `ลูกค้านี้มี ${existingCustomer._count.jobs} Job(s) ที่เชื่อมโยงอยู่ กรุณาลบ Job เหล่านั้นก่อน`,
                jobCount: existingCustomer._count.jobs
            });
            return;
        }
        // ลบข้อมูลลูกค้า (ถ้าไม่มี Jobs ที่เชื่อมโยง)
        yield prisma.customer.delete({
            where: { customer_id: customerId },
        });
        res.json({ message: "ลบข้อมูลลูกค้าเรียบร้อยแล้ว" });
    }
    catch (error) {
        console.error("Error deleting customer:", error);
        // จัดการ Foreign Key Constraint Error (เผื่อมีการเชื่อมโยงที่ไม่ได้คาดคิด)
        if (error.code === "P2003") {
            res.status(400).json({
                error: "ไม่สามารถลบลูกค้านี้ได้ เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่",
                details: "กรุณาลบ Job ที่เชื่อมโยงกับลูกค้านี้ก่อน"
            });
        }
        else {
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า" });
        }
    }
}));
exports.default = router;
