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
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// 📍 ดึงพนักงานทั้งหมด
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prisma.employee.findMany({
            include: { role: true }, // ✅ ดึงข้อมูล role ด้วย (ถ้าต้องการ)
        });
        res.json(employees);
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
    }
}));
// 📍 ดึงพนักงานตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const employee = yield prisma.employee.findUnique({
            where: { employee_id: parseInt(id, 10) },
            include: { role: true },
        });
        if (!employee) {
            res.status(404).json({ error: "ไม่พบพนักงานนี้" });
            return;
        }
        res.json(employee);
    }
    catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
    }
}));
// 📍 เพิ่มพนักงาน
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, password, email, phone, role_id } = req.body;
        // ตรวจสอบว่ามี username ซ้ำหรือไม่
        const existingUser = yield prisma.employee.findUnique({
            where: { username },
        });
        if (existingUser) {
            res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
            return;
        }
        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newEmployee = yield prisma.employee.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                email,
                phone,
                role_id,
            },
        });
        res.status(201).json(newEmployee);
    }
    catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน" });
    }
}));
// 📍 แก้ไขพนักงาน
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullname, email, phone, role_id, password } = req.body;
    try {
        const updateData = { fullname, email, phone };
        if (role_id !== undefined)
            updateData.role_id = role_id;
        if (password) {
            // เข้ารหัสรหัสผ่านใหม่
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            updateData.password = hashedPassword;
        }
        const updatedEmployee = yield prisma.employee.update({
            where: { employee_id: parseInt(id, 10) },
            data: updateData,
        });
        res.json(updatedEmployee);
    }
    catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลพนักงานได้" });
    }
}));
// 📍 ลบพนักงาน
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.employee.delete({
            where: { employee_id: parseInt(id, 10) },
        });
        res.json({ message: "ลบพนักงานเรียบร้อยแล้ว" });
    }
    catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "ไม่สามารถลบพนักงานได้" });
    }
}));
exports.default = router;
