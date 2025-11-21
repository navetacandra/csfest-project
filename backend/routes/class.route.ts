import { Router } from "express";

const router: Router = Router();

// Paths are relative to their mount point in index.ts (e.g., /classes)
router.get("/");
router.post("/enroll");
router.get("/:class_id");
router.post("/:class_id/posts");
router.get("/:class_id/posts/:post_id");
router.put("/:class_id/posts/:post_id");
router.delete("/:class_id/posts/:post_id");

export default router;
