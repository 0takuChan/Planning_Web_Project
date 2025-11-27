import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import jobStepRoutes from "./routes/jobStep";
import employeeRoutes from "./routes/employee";
import roleRoutes from "./routes/role";
import jobRoutes from "./routes/job";
import stepRoutes from "./routes/step";
import planningRoutes from "./routes/planning";
import customerRoutes from "./routes/customer";
import productionLogRoutes from "./routes/productionLog";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:8080", // frontend port
  credentials: true,
}));
app.use(express.json());


// ใช้ prefix /api
app.use("/api", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobsteps", jobStepRoutes);
app.use("/api/plannings", planningRoutes);
app.use("/api/productionlogs", productionLogRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/steps", stepRoutes);

export default app;
