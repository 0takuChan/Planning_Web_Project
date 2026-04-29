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
// ดึงประเภทการขนส่งทั้งหมด
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transportTypes = yield prisma.transportType.findMany({
            orderBy: { transport_type_id: "asc" },
        });
        res.json(transportTypes);
    }
    catch (error) {
        console.error("Error fetching transport types:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทการส่ง" });
    }
}));
exports.default = router;
