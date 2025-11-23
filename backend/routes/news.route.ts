import { Router, type Request, type Response } from "express";
import { NewsController } from "../controllers/news.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const newsController = new NewsController(sqlite);

router.get("/", (req: Request, res: Response) =>
  newsController.getAll(req, res),
);
router.get("/:id", (req: Request, res: Response) =>
  newsController.getById(req, res),
);

export default router;
