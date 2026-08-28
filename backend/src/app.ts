import express from "express";
import cors from "cors";

import serviceRoutes from "./routes/serviceRoutes";
import resourceRoutes from "./routes/resourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/services", serviceRoutes);
app.use("/api/resources", resourceRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

export default app;