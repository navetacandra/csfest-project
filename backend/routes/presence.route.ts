import { Router, type Request, type Response } from "express";
import { PresenceController } from "../controllers/presence.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const presenceController = new PresenceController(sqlite);

router.post(
  "/:class_id",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => presenceController.setPresence(req, res),
);

// student
router.get(
  "/recap",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => presenceController.getRecap(req, res),
);

// lecturer
router.get(
  "/:class_id/recap",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => presenceController.getRecap(req, res),
);

export default router;
