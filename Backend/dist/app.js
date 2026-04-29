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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const auth_1 = __importDefault(require("./routes/auth"));
const jobStep_1 = __importDefault(require("./routes/jobStep"));
const employee_1 = __importDefault(require("./routes/employee"));
const role_1 = __importDefault(require("./routes/role"));
const job_1 = __importDefault(require("./routes/job"));
const step_1 = __importDefault(require("./routes/step"));
const planning_1 = __importDefault(require("./routes/planning"));
const customer_1 = __importDefault(require("./routes/customer"));
const productionLog_1 = __importDefault(require("./routes/productionLog"));
const shipment_1 = __importDefault(require("./routes/shipment"));
const transportType_1 = __importDefault(require("./routes/transportType"));
const shipmentStatus_1 = __importDefault(require("./routes/shipmentStatus"));
const aiPlanning_1 = __importDefault(require("./routes/aiPlanning"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const updateShipmentStatus_1 = require("./utils/updateShipmentStatus");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:8080", // frontend port
    credentials: true,
}));
app.use(express_1.default.json());
// ใช้ prefix /api
app.use("/api", auth_1.default);
app.use("/api", authMiddleware_1.authMiddleware);
app.use("/api/employee", employee_1.default);
app.use("/api/customers", customer_1.default);
app.use("/api/jobs", job_1.default);
app.use("/api/jobsteps", jobStep_1.default);
app.use("/api/plannings", planning_1.default);
app.use("/api/plannings", aiPlanning_1.default);
app.use("/api/productionlogs", productionLog_1.default);
app.use("/api/roles", role_1.default);
app.use("/api/steps", step_1.default);
app.use("/api/shipments", shipment_1.default);
app.use("/api/transport-types", transportType_1.default);
app.use("/api/shipment-statuses", shipmentStatus_1.default);
// ==================== Cron Job: Update Shipment Status ====================
// รันทุก 1 ชั่วโมง (0 * * * * หมายถึง นาทีที่ 0 ของทุกชั่วโมง)
node_cron_1.default.schedule("0 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${new Date().toISOString()}] Running shipment status update cron job...`);
    yield (0, updateShipmentStatus_1.updateAllShipmentStatuses)();
}));
// รันครั้งแรกเมื่อเซิร์ฟเวอร์ start ทันที
console.log("Initializing shipment status update...");
(0, updateShipmentStatus_1.updateAllShipmentStatuses)();
exports.default = app;
