import { Router } from "express";

const router: Router = Router();

/**
 * TODO:
 * Implement full auth route and connect to controller
 */

router.post("/login");
router.delete("/logout");
router.get("/me");

export default router;
