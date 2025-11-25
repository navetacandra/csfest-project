import type { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Task } from "../models/task.model";
import { FileRepository } from "../repositories/file.repository";

interface TaskSubmitRequest {
  postId: number;
  studentId: number;
  classId: number;
  fileId: number;
}

export class TaskController {
  private taskService: TaskService;
  private fileRepo: FileRepository;

  constructor(sqlite: Sqlite) {
    this.taskService = new TaskService(sqlite);
    this.fileRepo = new FileRepository(sqlite);
  }

  async submitTask(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "file is required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { id: studentId } = req.user!;
      const { class_id: classId, post_id: postId } = req.params;
      const fileId = this.fileRepo.create({
        mahasiswa_id: studentId,
        mimetype: req.file!.mimetype,
        random_name: req.file.path.replace(Bun.env.UPLOAD_PATH || "", ""),
        size: req.file!.size,
        upload_name: req.file!.originalname,
        dosen_id: null,
      });

      if (!postId || !studentId || !classId || !fileId) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "postId, studentId, classId, and fileId are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (req.user) {
        if (req.user.role === "mahasiswa" && req.user.id !== studentId) {
          return res.status(403).json({
            code: 403,
            error: {
              message: "Students cannot submit tasks for other students",
              code: "FORBIDDEN_ACCESS",
            },
          } as ErrorResponse);
        }
      }

      const result = this.taskService.submitTask(
        Number(postId),
        Number(studentId),
        Number(classId),
        Number(fileId),
      );

      res.status(200).json({
        code: 200,
        data: result,
      } as SuccessResponse<Task>);
    } catch (error) {
      if (
        (error as Error).message === "Student is not enrolled in this class."
      ) {
        return res.status(400).json({
          code: 400,
          error: {
            message: (error as Error).message,
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if ((error as Error).message === "Task post not found.") {
        return res.status(404).json({
          code: 404,
          error: {
            message: (error as Error).message,
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      if ((error as Error).message === "Task already submitted.") {
        return res.status(400).json({
          code: 400,
          error: {
            message: (error as Error).message,
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const studentId = req.user?.id!;
      const filter: "all" | "completed" | "incoming" =
        (req.query.filter as "all" | "completed" | "incoming") || "all";

      if (isNaN(studentId)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid student ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (req.user) {
        if (req.user.role === "mahasiswa" && req.user.id !== studentId) {
          return res.status(403).json({
            code: 403,
            error: {
              message: "Students can only access their own tasks",
              code: "FORBIDDEN_ACCESS",
            },
          } as ErrorResponse);
        }
      }

      const tasks = this.taskService.getTasks(studentId, filter);

      res.status(200).json({
        code: 200,
        data: tasks,
      } as SuccessResponse<any[]>);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }
}
