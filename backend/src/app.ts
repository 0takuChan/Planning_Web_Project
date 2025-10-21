import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:8081", // frontend port
  credentials: true,
}));
app.use(express.json());

// ใช้ prefix /api
app.use("/api", authRoutes);

export default app;
