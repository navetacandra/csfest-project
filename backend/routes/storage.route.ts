import { Router, type Request, type Response } from "express";
import path from "node:path";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";

const router: Router = Router();

router.get(
  "/:randomName",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    const randomName = req.params.randomName;

    if (!randomName || !/^[a-zA-Z0-9._-]+$/.test(randomName)) {
      return res.status(400).json({
        code: 400,
        error: {
          message: "Invalid file name format",
          code: "VALIDATION_ERROR",
        },
      });
    }

    const filePath = path.resolve(`storage/${randomName}`);
    const fileName = path.basename(filePath);

    if (fileName !== randomName) {
      return res.status(400).json({
        code: 400,
        error: {
          message: "Invalid file path",
          code: "VALIDATION_ERROR",
        },
      });
    }

    res.sendFile(filePath, { root: "." });
  },
);

export default router;
