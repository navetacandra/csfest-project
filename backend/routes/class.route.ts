import { Router, type Request, type Response } from "express";
import { ClassController } from "../controllers/class.controller";
import { PostController } from "../controllers/post.controller";
import { TaskController } from "../controllers/task.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { sqlite } from "../config/database";
import multerUpload from "../middleware/multer";

const router: Router = Router();
const classController = new ClassController(sqlite);
const postController = new PostController(sqlite);
const taskController = new TaskController(sqlite);

router.get("/", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  classController.getFollowedClasses(req, res),
);
router.post("/", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  classController.enroll(req, res),
);

router.get("/:id", AuthMiddleware.authenticate, (req: Request, res: Response) =>
  classController.getById(req, res),
);

router.post(
  "/:class_id/posts",
  AuthMiddleware.authenticate,
  multerUpload("post_attachment").single("file"),
  (req: Request, res: Response) => postController.create(req, res),
);
router.get(
  "/:class_id/posts/:id",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => postController.getById(req, res),
);
router.put(
  "/:class_id/posts/:id",
  AuthMiddleware.authenticate,
  multerUpload("post_attachment").single("file"),
  (req: Request, res: Response) => postController.update(req, res),
);
router.delete(
  "/:class_id/posts/:id",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => postController.delete(req, res),
);

router.post(
  "/:class_id/posts/:post_id/task",
  AuthMiddleware.authenticate,
  multerUpload("task_attachment").single("file"),
  (req: Request, res: Response) => taskController.submitTask(req, res),
);

export default router;
