import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import authRoutes from "./routes/auth";
import jobStepRoutes from "./routes/jobStep";
import employeeRoutes from "./routes/employee";
import roleRoutes from "./routes/role";
import jobRoutes from "./routes/job";
import stepRoutes from "./routes/step";
import planningRoutes from "./routes/planning";
import customerRoutes from "./routes/customer";
import productionLogRoutes from "./routes/productionLog";
import shipmentRoutes from "./routes/shipment";
import transportTypeRoutes from "./routes/transportType";
import shipmentStatusRoutes from "./routes/shipmentStatus";
import aiPlanningRoutes from "./routes/aiPlanning";
import { authMiddleware } from "./middleware/authMiddleware";
import { updateAllShipmentStatuses } from "./utils/updateShipmentStatus";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:8080", // frontend port
  credentials: true,
}));
app.use(express.json());


// ใช้ prefix /api
app.use("/api", authRoutes);
app.use("/api", authMiddleware);
app.use("/api/employee", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobsteps", jobStepRoutes);
app.use("/api/plannings", planningRoutes);
app.use("/api/plannings", aiPlanningRoutes);
app.use("/api/productionlogs", productionLogRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/transport-types", transportTypeRoutes);
app.use("/api/shipment-statuses", shipmentStatusRoutes);

// ==================== Cron Job: Update Shipment Status ====================
// รันทุก 1 ชั่วโมง (0 * * * * หมายถึง นาทีที่ 0 ของทุกชั่วโมง)
cron.schedule("0 * * * *", async () => {
  console.log(
    `[${new Date().toISOString()}] Running shipment status update cron job...`
  );
  await updateAllShipmentStatuses();
});

// รันครั้งแรกเมื่อเซิร์ฟเวอร์ start ทันที
console.log("Initializing shipment status update...");
updateAllShipmentStatuses();

export default app;
