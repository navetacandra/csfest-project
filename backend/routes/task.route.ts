import { Router, type Request, type Response } from "express";
import { TaskController } from "../controllers/task.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const taskController = new TaskController(sqlite);

router.post("/", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  taskController.submitTask(req, res),
);
router.get("/", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  taskController.getTasks(req, res),
);

export default router;
