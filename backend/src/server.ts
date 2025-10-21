import express from "express";
import bodyParser from "body-parser";
import employeeRoutes from "./routes/employee.js"; 
import customers from "./routes/customer.js";
import jobRoutes from "./routes/job.js";
import jobStepRoutes from "./routes/jobStep.js";
import planningRoutes from "./routes/planning.js";
import productionLogRoutes from "./routes/productionLog.js";
import roleRoutes from "./routes/role.js";
import stepRoutes from "./routes/step.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

// ใช้งาน router
app.use("/api/employee", employeeRoutes);
app.use("/api/customers", customers);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobsteps", jobStepRoutes);
app.use("/api/plannings", planningRoutes);
app.use("/api/productionlogs", productionLogRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
