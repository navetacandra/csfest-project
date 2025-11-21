import { Router } from "express";

const router: Router = Router();

/**
 * TODO:
 * Implement full presence route and connect to controller
 */

router.get("/recap");
router.get("/:class_id");
router.post("/:class_id");

export default router;
