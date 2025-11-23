import { Router, type Request, type Response } from "express";
import { NewsController } from "../controllers/news.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const newsController = new NewsController(sqlite);

router.get(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => newsController.getAll(req, res),
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => newsController.create(req, res),
);
router.get("/:id", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  newsController.getById(req, res),
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => newsController.update(req, res),
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => newsController.delete(req, res),
);

export default router;
