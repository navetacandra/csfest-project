import { Router } from "express";

const router: Router = Router();

// Paths are relative to their mount point in index.ts (e.g., /admin/news)
router.get("/");
router.post("/");
router.get("/:id");
router.put("/:id");
router.delete("/:id");

export default router;
