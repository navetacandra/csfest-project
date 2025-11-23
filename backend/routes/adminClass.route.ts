import { Router, type Request, type Response } from "express";
import { ClassController } from "../controllers/class.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const classController = new ClassController(sqlite);

router.get(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => classController.getAll(req, res),
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => classController.create(req, res),
);
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => classController.getById(req, res),
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => classController.update(req, res),
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => classController.delete(req, res),
);

export default router;
