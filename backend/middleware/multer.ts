import { mkdirSync } from "node:fs";
import { extname, resolve as pathResolve } from "node:path";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

const ALLOWED_MIME_TYPES: string[] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

Bun.env.UPLOAD_PATH = Bun.env.UPLOAD_PATH?.endsWith("/")
  ? Bun.env.UPLOAD_PATH
  : Bun.env.UPLOAD_PATH + "/";

const storage = (directory: string = "") =>
  multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadPath = pathResolve(__dirname, "../uploads", directory);
      mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },

    filename: (req: Request, file: Express.Multer.File, cb) => {
      const random = Bun.randomUUIDv7("hex", Date.now());
      cb(null, random);
    },
  });

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(
    new Error(
      "File type not allowed. Only PDF, JPG, PNG, and DOCX are permitted.",
    ),
  );
};

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(
    new Error(
      "File type not allowed. Only PDF, JPG, PNG, and DOCX are permitted.",
    ),
  );
};

const multerUpload = (directory: string = "", image: boolean = false) =>
  multer({
    storage: storage(directory),
    fileFilter: image ? imageFileFilter : fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

export default multerUpload;
