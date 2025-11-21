import { Router } from "express";

const router: Router = Router();

/**
 * TODO:
 * Implement full major and studyProgram administration route and connect to controller
 */

router.get("/");
router.post("/");
router.delete("/:id");
router.get("/:major_id/study_program");
router.post("/:major_id/study_program");
router.delete("/:major_id/study_program/:id");

export default router;