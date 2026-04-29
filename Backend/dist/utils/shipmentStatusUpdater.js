"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShipmentStatus = void 0;
const calculateShipmentStatus = (departure_date, arrival_date, actual_delivery_date) => {
    const today = new Date();
    if (actual_delivery_date) {
        return 3; // ส่งแล้วจริง
    }
    if (today < departure_date) {
        return 1; // เตรียมส่ง
    }
    if (today >= departure_date && today < arrival_date) {
        return 2; // กำลังจัดส่ง
    }
    return 3; // ส่งแล้ว
};
exports.calculateShipmentStatus = calculateShipmentStatus;
