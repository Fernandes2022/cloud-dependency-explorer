import { Router } from "express";

import { getResourceImpact } from "../services/graphService";

const router = Router();

router.get("/:name/impact", async (req, res) => {
  try {
    const impact = await getResourceImpact(req.params.name);

    res.json({
      resource: req.params.name,
      affectedServices: impact,
    });
  } catch (error) {
    console.error("Failed to calculate resource impact:", error);

    res.status(500).json({
      error: "Unable to calculate resource impact",
    });
  }
});

export default router;