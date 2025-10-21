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
// 📍 ดึงลูกค้าทั้งหมด
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany();
        res.json(customers);
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
    }
}));
// 📍 ดึงลูกค้าตาม ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const customer = yield prisma.customer.findUnique({
            where: { customer_id: parseInt(id, 10) },
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
// 📍 เพิ่มลูกค้าใหม่
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_code, fullname, email, phone, address_detail } = req.body;
        const newCustomer = yield prisma.customer.create({
            data: { customer_code, fullname, email, phone, address_detail },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า" });
    }
}));
exports.default = router;
