import type { Request, Response } from "express";
import { MahasiswaService } from "../services/mahasiswa.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Mahasiswa } from "../models/mahasiswa.model";

interface MahasiswaCreateRequest {
  major_id: number;
  study_program_id: number;
  nim: string;
  name: string;
  email: string;
  username: string;
  password: string;
}

interface MahasiswaUpdateRequest {
  major_id?: number;
  study_program_id?: number;
  nim?: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
}

export class MahasiswaController {
  private mahasiswaService: MahasiswaService;

  constructor(sqlite: Sqlite) {
    this.mahasiswaService = new MahasiswaService(sqlite);
  }

  async getAll(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        major_id,
        study_program_id,
      } = req.query;

      const parsedPage = Number(page);
      const parsedLimit = Number(limit);
      const parsedMajorId = major_id ? Number(major_id) : undefined;
      const parsedStudyProgramId = study_program_id
        ? Number(study_program_id)
        : undefined;

      const students = this.mahasiswaService.getAll(
        parsedPage,
        parsedLimit,
        name ? String(name) : undefined,
        parsedMajorId,
        parsedStudyProgramId,
      );

      const totalData = students.length;
      const totalPages = Math.ceil(totalData / parsedLimit);

      res.json({
        code: 200,
        data: students,
        meta: {
          size: students.length,
          page: parsedPage,
          limit: parsedLimit,
          totalData: totalData,
          totalPage: totalPages,
        },
      } as SuccessResponse<Mahasiswa[]>);
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
            message: "Invalid mahasiswa ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const mahasiswa = this.mahasiswaService.getById(id);

      res.json({
        code: 200,
        data: mahasiswa,
      } as SuccessResponse<Mahasiswa>);
    } catch (error) {
      if ((error as Error).message === "Mahasiswa not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Mahasiswa not found",
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
      const {
        major_id,
        study_program_id,
        nim,
        name,
        email,
        username,
        password,
      } = req.body as MahasiswaCreateRequest;

      if (
        !major_id ||
        !study_program_id ||
        !nim ||
        !name ||
        !email ||
        !username ||
        !password
      ) {
        return res.status(400).json({
          code: 400,
          error: {
            message:
              "All fields are required: major_id, study_program_id, nim, name, email, username, password",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const mahasiswaData = {
        major_id,
        study_program_id,
        nim,
        name,
        email,
        username,
        password,
      };

      const createdMahasiswa =
        await this.mahasiswaService.create(mahasiswaData);

      res.status(201).json({
        code: 201,
        data: createdMahasiswa,
      } as SuccessResponse<Mahasiswa>);
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
            message: "Invalid mahasiswa ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const {
        major_id,
        study_program_id,
        nim,
        name,
        email,
        username,
        password,
      } = req.body as MahasiswaUpdateRequest;

      const updateData: Partial<Mahasiswa> = {};
      if (major_id) updateData.major_id = major_id;
      if (study_program_id) updateData.study_program_id = study_program_id;
      if (nim) updateData.nim = nim;
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (password) updateData.password = password;

      const updatedMahasiswa = await this.mahasiswaService.update(
        id,
        updateData,
      );

      res.json({
        code: 200,
        data: updatedMahasiswa,
      } as SuccessResponse<Mahasiswa>);
    } catch (error) {
      if ((error as Error).message === "Mahasiswa not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Mahasiswa not found",
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
            message: "Invalid mahasiswa ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const deletedMahasiswa = this.mahasiswaService.delete(id);

      res.json({
        code: 200,
        data: deletedMahasiswa,
      } as SuccessResponse<Mahasiswa>);
    } catch (error) {
      if ((error as Error).message === "Mahasiswa not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Mahasiswa not found",
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
