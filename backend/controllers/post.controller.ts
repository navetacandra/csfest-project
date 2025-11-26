import type { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Post } from "../models/post.model";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";
import { FileRepository } from "../repositories/file.repository";

interface PostCreateRequest {
  class_id: number;
  class_enrollment_id: number;
  file_id?: number;
  message?: string;
  type: "post" | "task";
}

interface PostUpdateRequest {
  file_id?: number;
  message?: string;
}

export class PostController {
  private postService: PostService;
  private fileRepo: FileRepository;
  private enrollmentRepository: ClassEnrollmentRepository;

  constructor(sqlite: Sqlite) {
    this.postService = new PostService(sqlite);
    this.fileRepo = new FileRepository(sqlite);
    this.enrollmentRepository = new ClassEnrollmentRepository(sqlite);
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid post ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (req.user) {
        const accessor:
          | { role: "mahasiswa"; studentId: number }
          | { role: "dosen" } =
          req.user.role === "mahasiswa"
            ? { role: "mahasiswa" as const, studentId: req.user.id }
            : { role: req.user.role as "dosen" };

        const post = this.postService.getById(id, accessor);

        res.json({
          code: 200,
          data: post,
        } as SuccessResponse<Post>);
      } else {
        const post = this.postService.getById(id);

        res.json({
          code: 200,
          data: post,
        } as SuccessResponse<Post>);
      }
    } catch (error) {
      if ((error as Error).message === "Post not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Post not found",
            code: "NOT_FOUND",
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

  async create(req: Request, res: Response) {
    try {
      const { class_id } = req.params!;
      const { id: userId, role } = req.user!;
      const class_enrollment = this.enrollmentRepository.find(
        userId,
        Number(class_id),
        role,
      );
      const { message, type } = req.body as PostCreateRequest;
      let file_id: number | null = null;

      if (role !== "dosen") {
        return res.status(403).json({
          code: 403,
          error: {
            message: "Your role is not dosen",
            code: "FORBIDDEN",
          },
        } as ErrorResponse);
      }

      if (req.file) {
        file_id = this.fileRepo.create({
          mahasiswa_id: null,
          mimetype: req.file!.mimetype,
          random_name: req.file.path.replace(Bun.env.UPLOAD_PATH || "", ""),
          size: req.file!.size,
          upload_name: req.file!.originalname,
          dosen_id: userId,
        });
      }

      if (
        class_id === undefined ||
        class_enrollment === undefined ||
        class_enrollment === null ||
        !type
      ) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "class_id, class_enrollment_id, and type are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (!["post", "task"].includes(type)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Type must be either 'post' or 'task'",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const postData = {
        class_id,
        class_enrollment_id: class_enrollment.id,
        ...(file_id !== undefined && { file_id: Number(file_id) }),
        ...(message && { message }),
        type,
      };

      const createdPost = this.postService.create(
        postData as Omit<Post, "id" | "created_at" | "updated_at">,
      );

      res.status(201).json({
        code: 201,
        data: createdPost,
      } as SuccessResponse<Post>);
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

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const { id: userId, role } = req.user!;
      if (role !== "dosen") {
        return res.status(403).json({
          code: 403,
          error: {
            message: "Your role is not dosen",
            code: "FORBIDDEN",
          },
        } as ErrorResponse);
      }

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid post ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { message } = req.body as PostUpdateRequest;
      let file_id: number | null = null;

      const current = this.postService.getById(id);
      if (!current) {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Post not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      if (req.file) {
        file_id = this.fileRepo.create({
          mahasiswa_id: null,
          mimetype: req.file!.mimetype,
          random_name: req.file.path.replace(Bun.env.UPLOAD_PATH || "", ""),
          size: req.file!.size,
          upload_name: req.file!.originalname,
          dosen_id: userId,
        });

        if (current.file_id) {
          const oldFile = this.fileRepo.findById(current.file_id);
          if (oldFile) {
            this.fileRepo.delete(current.file_id);
            Bun.file(`${Bun.env.UPLOAD_PATH}/${oldFile?.random_name}`).delete();
          }
        }
      }

      const updateData: Partial<Post> = {};
      if (file_id !== undefined) updateData.file_id = Number(file_id);
      if (message !== undefined) updateData.message = message;

      const updatedPost = this.postService.update(id, updateData);

      res.json({
        code: 200,
        data: updatedPost,
      } as SuccessResponse<Post>);
    } catch (error) {
      if ((error as Error).message === "Post not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Post not found",
            code: "NOT_FOUND",
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

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid post ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const current = this.postService.getById(id);
      if (!current) {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Post not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      const deletedPost = this.postService.delete(id);
      if (current.file_id) {
        const oldFile = this.fileRepo.findById(current.file_id);
        if (oldFile) {
          this.fileRepo.delete(current.file_id);
          Bun.file(`${Bun.env.UPLOAD_PATH}/${oldFile?.random_name}`).delete();
        }
      }

      res.json({
        code: 200,
        data: deletedPost,
      } as SuccessResponse<Post>);
    } catch (error) {
      if ((error as Error).message === "Post not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Post not found",
            code: "NOT_FOUND",
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
}
