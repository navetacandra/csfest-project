import type { Request, Response } from "express";
import { MajorService } from "../services/major.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Major } from "../models/major.model";

interface MajorCreateRequest {
  name: string;
}

interface MajorUpdateRequest {
  name?: string;
}

export class MajorController {
  private majorService: MajorService;

  constructor(sqlite: Sqlite) {
    this.majorService = new MajorService(sqlite);
  }

  async getAll(req: Request, res: Response) {
    try {
      const majors = this.majorService.getAll();

      res.json({
        code: 200,
        data: majors,
        meta: {
          size: majors.length,
          page: 1,
          limit: majors.length,
          totalData: majors.length,
          totalPage: 1,
        },
      } as SuccessResponse<Major[]>);
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
            message: "Invalid major ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const major = this.majorService.getById(id);

      res.json({
        code: 200,
        data: major,
      } as SuccessResponse<Major>);
    } catch (error) {
      if ((error as Error).message === "Major not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Major not found",
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
      const { name } = req.body as MajorCreateRequest;

      if (!name) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Name is required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const majorData = {
        name,
      };

      const createdMajor = this.majorService.create(majorData);

      res.status(201).json({
        code: 201,
        data: createdMajor,
      } as SuccessResponse<Major>);
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
            message: "Invalid major ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { name } = req.body as MajorUpdateRequest;

      if (!name) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Name is required for update",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const updatedMajor = this.majorService.update(id, { name });

      res.json({
        code: 200,
        data: updatedMajor,
      } as SuccessResponse<Major>);
    } catch (error) {
      if ((error as Error).message === "Major not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Major not found",
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
            message: "Invalid major ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const deletedMajor = this.majorService.delete(id);

      res.json({
        code: 200,
        data: deletedMajor,
      } as SuccessResponse<Major>);
    } catch (error) {
      if ((error as Error).message === "Major not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Major not found",
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
