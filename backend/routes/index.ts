import { Router, type Request, type Response } from "express";
import type { SuccessResponse } from "../config/response";

const router: Router = Router();

// health-check
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    data: "Welcome to Ku-LMSin API",
  } as SuccessResponse<string>);
});

export default router;
