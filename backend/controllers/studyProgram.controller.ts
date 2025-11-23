import type { Request, Response } from "express";
import { StudyProgramService } from "../services/studyProgram.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { StudyProgram } from "../models/study_program.model";

interface StudyProgramCreateRequest {
  name: string;
  major_id: number;
}

interface StudyProgramUpdateRequest {
  name?: string;
  major_id?: number;
}

export class StudyProgramController {
  private studyProgramService: StudyProgramService;

  constructor(sqlite: Sqlite) {
    this.studyProgramService = new StudyProgramService(sqlite);
  }

  async getByMajorId(req: Request, res: Response) {
    try {
      const major_id = parseInt(req.params.major_id as string);

      if (isNaN(major_id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid major ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const studyPrograms = this.studyProgramService.getByMajorId(major_id);

      res.json({
        code: 200,
        data: studyPrograms,
      } as SuccessResponse<StudyProgram[]>);
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

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid study program ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      return res.status(501).json({
        code: 501,
        error: {
          message: "Get by ID is not implemented in StudyProgramService",
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

  async create(req: Request, res: Response) {
    try {
      const { name, major_id } = req.body as StudyProgramCreateRequest;

      if (!name || !major_id) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Name and major_id are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const studyProgramData = {
        name,
        major_id: Number(major_id),
      };

      const createdStudyProgram =
        this.studyProgramService.create(studyProgramData);

      res.status(201).json({
        code: 201,
        data: createdStudyProgram,
      } as SuccessResponse<StudyProgram>);
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
            "Update functionality for study programs is not implemented in service",
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
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid study program ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const deletedStudyProgram = this.studyProgramService.delete(id);

      res.json({
        code: 200,
        data: deletedStudyProgram,
      } as SuccessResponse<StudyProgram>);
    } catch (error) {
      if ((error as Error).message === "Study Program not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Study Program not found",
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
