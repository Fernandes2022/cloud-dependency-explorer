import { Router } from "express";

import {
  getServices,
  getServiceByName,
  getServiceDependencies,
  getResourceImpact,
  getServiceGraph,
} from "../services/graphService";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const services = await getServices();

    res.json({
      data: services,
    });
  } catch (error) {
    console.error("Failed to get services:", error);

    res.status(500).json({
      error: "Unable to retrieve services",
    });
  }
});

router.get("/:name/dependencies", async (req, res) => {
  try {
    const dependencies = await getServiceDependencies(req.params.name);

    res.json({
      data: dependencies,
    });
  } catch (error) {
    console.error("Failed to get dependencies:", error);

    res.status(500).json({
      error: "Unable to retrieve service dependencies",
    });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const service = await getServiceByName(req.params.name);

    if (!service) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    res.json({
      data: service,
    });
  } catch (error) {
    console.error("Failed to get service:", error);

    res.status(500).json({
      error: "Unable to retrieve service",
    });
  }
});

router.get("/:name/graph", async (req, res) => {
  try {
    const graph = await getServiceGraph(req.params.name);

    res.json({
      data: graph,
    });
  } catch (error) {
    console.error("Failed to get service graph:", error);

    res.status(500).json({
      error: "Unable to retrieve service graph",
    });
  }
});

export default router;