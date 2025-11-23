import { Router, type Request, type Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();
const authController = new AuthController(sqlite);

router.post("/login", (req: Request, res: Response) =>
  authController.login(req, res),
);

router.get(
  "/profile",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => authController.getProfile(req, res),
);

router.delete(
  "/logout",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => authController.logout(req, res),
);

export default router;
