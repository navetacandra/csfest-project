import { Router, type Request, type Response } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

import { DashboardController } from "../controllers/dashboard.controller";

const router: Router = Router();
const dashboardController = new DashboardController(sqlite);

router.get("/", AuthMiddleware.authenticate, (req: Request, res: Response) => {
  dashboardController.getDashboard(req, res);
});

export default router;
