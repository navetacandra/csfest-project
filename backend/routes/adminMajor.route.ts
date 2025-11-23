import { Router, type Request, type Response } from "express";
import { MajorController } from "../controllers/major.controller";
import { StudyProgramController } from "../controllers/studyProgram.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const majorController = new MajorController(sqlite);
const studyProgramController = new StudyProgramController(sqlite);

router.get(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => majorController.getAll(req, res),
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => majorController.create(req, res),
);
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => majorController.getById(req, res),
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => majorController.update(req, res),
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => majorController.delete(req, res),
);

router.get(
  "/:major_id/study_program",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) =>
    studyProgramController.getByMajorId(req, res),
);
router.post(
  "/:major_id/study_program",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => studyProgramController.create(req, res),
);
router.delete(
  "/:major_id/study_program/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => studyProgramController.delete(req, res),
);

export default router;
