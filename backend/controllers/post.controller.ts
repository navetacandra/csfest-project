import type { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Post } from "../models/post.model";

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

  constructor(sqlite: Sqlite) {
    this.postService = new PostService(sqlite);
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
      const { class_id, class_enrollment_id, file_id, message, type } =
        req.body as PostCreateRequest;

      if (
        class_id === undefined ||
        class_enrollment_id === undefined ||
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
        class_enrollment_id,
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

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid post ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { file_id, message } = req.body as PostUpdateRequest;

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

      const deletedPost = this.postService.delete(id);

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
