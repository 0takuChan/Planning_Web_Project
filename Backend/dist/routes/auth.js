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
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);
    const user = yield prisma.employee.findUnique({
        where: { username },
        include: { role: true }
    });
    console.log("User from DB:", user);
    if (!user)
        return res.status(401).json({ message: "Invalid username or password" });
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    console.log("bcrypt compare result:", valid);
    if (!valid)
        return res.status(401).json({ message: "Invalid username or password" });
    const token = jsonwebtoken_1.default.sign({
        id: user.employee_id,
        username: user.username,
        role: user.role.role_name,
    }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.employee_id,
            fullname: user.fullname,
            email: user.email, // เพิ่มบรรทัดนี้
            phone: user.phone, // เพิ่มบรรทัดนี้
            role: user.role.role_name,
        },
    });
}));
router.get("/profile", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ user: req.user });
}));
exports.default = router;
