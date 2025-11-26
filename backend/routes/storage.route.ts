import { Router, type Request, type Response } from "express";
import path from "node:path";
import { sqlite } from "../config/database";
import { FileRepository } from "../repositories/file.repository";
import Response from "superagent/lib/node/response";

const router: Router = Router();
const fileRepo = new FileRepository(sqlite);

router.use(async (req: Request, res: Response) => {
  if (req.method !== "GET") return res.sendStatus(418);
  const randomName = req.url.replace(/^\//, "");

  if (!randomName || !/^[\/a-zA-Z0-9._-]+$/.test(randomName)) {
    return res.status(400).json({
      code: 400,
      error: {
        message: "Invalid file name format",
        code: "VALIDATION_ERROR",
      },
    });
  }

  const file = fileRepo.findByRandomName(randomName);
  const filePath = path.resolve(`${Bun.env.UPLOAD_PATH}/${randomName}`);
  const fileName = path.basename(filePath);
  const exists = await Bun.file(filePath).exists();

  if (!file || !exists) {
    return res.status(400).json({
      code: 400,
      error: {
        message: "Invalid file path",
        code: "VALIDATION_ERROR",
      },
    });
  }

  res.setHeader("Content-Type", file.mimetype || "application/octet-stream");
  res.sendFile(filePath);
});

export default router;
