import { Router, type Request, type Response } from "express";
import { MahasiswaController } from "../controllers/mahasiswa.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";
import { sqlite } from "../config/database";

const router = Router();
const mahasiswaController = new MahasiswaController(sqlite);

router.get(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => mahasiswaController.getAll(req, res),
);
router.post(
  "/",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => mahasiswaController.create(req, res),
);
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => mahasiswaController.getById(req, res),
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => mahasiswaController.update(req, res),
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RoleMiddleware.requireRole(["admin"]),
  (req: Request, res: Response) => mahasiswaController.delete(req, res),
);

export default router;
