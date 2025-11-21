import { Router, type Request, type Response } from "express";
import type { SuccessResponse } from "../config/response";

// Route imports
import authRoute from "./auth.route";
import adminClassRoute from "./adminClass.route";
import adminDosenRoute from "./adminDosen.route";
import adminMahasiswaRoute from "./adminMahasiswa.route";
import adminMajorRoute from "./adminMajor.route";
import adminNewsRoute from "./adminNews.route";
import classRoute from "./class.route";
import newsRoute from "./news.route";
import dashboardRoute from "./dashboard.route";
import presenceRoute from "./presence.route";
import scheduleRoute from "./schedule.route";
import storageRoute from "./storage.route";
import taskRoute from "./task.route";

const router: Router = Router();
const adminRouter: Router = Router();

// Health-check for the root /api endpoint
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    code: 200,
    data: "Welcome to Ku-LMSin API",
  } as SuccessResponse<string>);
});

router.use(authRoute);
router.use("/classes", classRoute);
router.use("/news", newsRoute);
router.use("/schedule", scheduleRoute);
router.use("/storage", storageRoute);
router.use("/tasks", taskRoute);
router.use("/dashboard", dashboardRoute);
router.use("/presence", presenceRoute);

adminRouter.use("/classes", adminClassRoute);
adminRouter.use("/news", adminNewsRoute);
adminRouter.use("/dosen", adminDosenRoute);
adminRouter.use("/mahasiswa", adminMahasiswaRoute);
adminRouter.use("/major", adminMajorRoute);

router.use("/admin", adminRouter);

export default router;
