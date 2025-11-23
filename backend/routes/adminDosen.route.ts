import { Router, type Request, type Response } from "express";
import { DosenController } from "../controllers/dosen.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";
import { sqlite } from "../config/database";

const router = Router();
const dosenController = new DosenController(sqlite);

router.get(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => dosenController.getAll(req, res),
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => dosenController.create(req, res),
);
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => dosenController.getById(req, res),
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => dosenController.update(req, res),
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => dosenController.delete(req, res),
);

export default router;
