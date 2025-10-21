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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// คีย์สำหรับ JWT (ควรใช้จาก .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const employee = yield prisma.employee.findUnique({
            where: { username },
            include: { role: true },
        });
        if (!employee) {
            res.status(404).json({ error: "ไม่พบผู้ใช้นี้" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, employee.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
            return;
        }
        // สร้าง JWT Token
        const token = jsonwebtoken_1.default.sign({ id: employee.employee_id, role: employee.role.role_name }, JWT_SECRET, { expiresIn: "2h" });
        res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            user: {
                id: employee.employee_id,
                fullname: employee.fullname,
                role: employee.role.role_name,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    }
}));
exports.default = router;
