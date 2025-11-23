import { Router, type Request, type Response } from "express";
import { ClassController } from "../controllers/class.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const classController = new ClassController(sqlite);

router.get("/", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  classController.getSchedule(req, res),
);
router.get(
  "/current",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => classController.getSchedule(req, res),
);

export default router;
