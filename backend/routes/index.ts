import { Router, type Request, type Response } from "express";

const router: Router = Router();

// health-check
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    data: "Welcome to Ku-LMSin API",
  });
});

export default router;
