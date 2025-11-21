import { Router } from "express";

const router: Router = Router();

// Paths are relative to their mount point in index.ts (e.g., /news)
router.get("/:id");

export default router;
