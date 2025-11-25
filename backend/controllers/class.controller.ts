import type { Request, Response } from "express";
import { ClassService, type ClassDetails } from "../services/class.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Class } from "../models/class.model";
import { ClassEnrollmentRepository } from "../repositories/classEnrollment.repository";

interface ClassCreateRequest {
  name: string;
  schedule: number;
  start_time: string;
  end_time: string;
}

interface ClassUpdateRequest {
  name?: string;
  schedule?: number;
  start_time?: string;
  end_time?: string;
}

export class ClassController {
  private classService: ClassService;
  private classEnrollmentRepository: ClassEnrollmentRepository;

  constructor(sqlite: Sqlite) {
    this.classService = new ClassService(sqlite);
    this.classEnrollmentRepository = new ClassEnrollmentRepository(sqlite);
  }

  async getAll(req: Request, res: Response) {
    return res.status(501).json({
      code: 501,
      error: {
        message:
          "Get all functionality for classes is not implemented in service",
        code: "NOT_IMPLEMENTED",
      },
    } as ErrorResponse);
  }

  async getById(req: Request, res: Response) {
    try {
      const { id: userId, role } = req.user!;
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid class ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (role !== "admin") {
        const enrollment = this.classEnrollmentRepository.find(
          userId,
          id,
          role,
        );
        if (!enrollment) {
          return res.status(403).json({
            code: 403,
            error: {
              message: "User not enrolled to this class",
              code: "FORBIDDEN",
            },
          } as ErrorResponse);
        }
      }

      const data = this.classService.getClassDetails(id);

      return res.status(200).json({
        code: 200,
        data,
      } as SuccessResponse<ClassDetails>);
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

  async create(req: Request, res: Response) {
    try {
      const { name, schedule, start_time, end_time } =
        req.body as ClassCreateRequest;

      if (!name || schedule === undefined || !start_time || !end_time) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Name, schedule, start_time, and end_time are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const classData = {
        name,
        schedule: Number(schedule),
        start_time,
        end_time,
      };

      const createdClass = this.classService.create(classData);

      res.status(201).json({
        code: 201,
        data: createdClass,
      } as SuccessResponse<Class>);
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
      return res.status(501).json({
        code: 501,
        error: {
          message:
            "Update functionality for classes is not implemented in service",
          code: "NOT_IMPLEMENTED",
        },
      } as ErrorResponse);
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

  async delete(req: Request, res: Response) {
    try {
      return res.status(501).json({
        code: 501,
        error: {
          message:
            "Delete functionality for classes is not implemented in service",
          code: "NOT_IMPLEMENTED",
        },
      } as ErrorResponse);
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

  async getSchedule(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          error: {
            message: "Authentication required",
            code: "UNAUTHORIZED",
          },
        } as ErrorResponse);
      }

      let day: number | undefined;
      if (req.path.includes("current")) {
        day = new Date().getDay();
      }

      const schedule = this.classService.getSchedule(
        req.user.id,
        req.user.role,
        day,
      );

      res.json({
        code: 200,
        data: schedule,
      } as SuccessResponse<Class[]>);
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

  async enroll(req: Request, res: Response) {
    try {
      const { id: userId, role } = req.user!;
      const { enroll_key } = req.body;

      if (!enroll_key || !userId || !role) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "enroll_key, userId, and role are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (!["mahasiswa", "dosen"].includes(role)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Role must be either 'mahasiswa' or 'dosen'",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const classEnrolled = this.classService.enroll(
        enroll_key,
        Number(userId),
        role as "mahasiswa" | "dosen",
      );

      res.json({
        code: 200,
        data: classEnrolled,
      } as SuccessResponse<Class>);
    } catch (error) {
      if ((error as Error).message.includes("not found")) {
        return res.status(404).json({
          code: 404,
          error: {
            message: (error as Error).message,
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      if ((error as Error).message.includes("already enrolled")) {
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

  async getFollowedClasses(req: Request, res: Response) {
    try {
      const userId = req.user?.id!;
      const role = req.user?.role!;

      if (isNaN(userId) || !["mahasiswa", "dosen", "admin"].includes(role)) {
        return res.status(400).json({
          code: 400,
          error: {
            message:
              "Valid userId and role (mahasiswa, dosen, or admin) are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const followedClasses = this.classService.getFollowedClasses(
        userId,
        role,
      );

      res.json({
        code: 200,
        data: followedClasses,
      } as SuccessResponse<Class[]>);
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
