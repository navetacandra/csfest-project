import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { extname, resolve as pathResolve } from "node:path";
import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";

const ALLOWED_MIME_TYPES: string[] = [
  "application/pdf", // .pdf
  "image/jpeg", // .jpg | .jpeg
  "image/png", // .png
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = (directory: string = "") =>
  multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadPath = pathResolve(__dirname, "../uploads", directory);
      mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },

    filename: (req: Request, file: Express.Multer.File, cb) => {
      const random = randomUUID({ disableEntropyCache: true });
      const ext = extname(file.originalname);
      cb(null, `${random}${ext}`);
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

const multerUpload = (directory: string = "") =>
  multer({
    storage: storage(directory),
    fileFilter: fileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

export default multerUpload;
