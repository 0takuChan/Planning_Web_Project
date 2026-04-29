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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShipmentNumber = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateShipmentNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const baseTime = `${day}${month}${year}${hour}${minute}${second}`;
    // หา shipment ที่ถูกสร้างในวินาทีเดียวกัน
    const existingCount = yield prisma.shipment.count({
        where: {
            shipment_numbar: {
                startsWith: `SM${baseTime}`,
            },
        },
    });
    const runningNumber = existingCount + 1;
    return `SM${baseTime}${runningNumber}TH`;
});
exports.generateShipmentNumber = generateShipmentNumber;
