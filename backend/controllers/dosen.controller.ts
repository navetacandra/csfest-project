import type { Request, Response } from "express";
import { DosenService } from "../services/dosen.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Dosen } from "../models/dosen.model";

interface DosenCreateRequest {
  nip: string;
  name: string;
  username?: string;
  password: string;
}

interface DosenUpdateRequest {
  nip?: string;
  name?: string;
}

export class DosenController {
  private dosenService: DosenService;

  constructor(sqlite: Sqlite) {
    this.dosenService = new DosenService(sqlite);
  }

  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, nip, name } = req.query;

      const parsedPage = Number(page);
      const parsedLimit = Number(limit);

      const dosens = this.dosenService.getAll(
        parsedPage,
        parsedLimit,
        nip ? String(nip) : undefined,
        name ? String(name) : undefined,
      );

      const totalData = dosens.length;
      const totalPages = Math.ceil(totalData / parsedLimit);

      res.json({
        code: 200,
        data: dosens,
        meta: {
          size: dosens.length,
          page: parsedPage,
          limit: parsedLimit,
          totalData: totalData,
          totalPage: totalPages,
        },
      } as SuccessResponse<Dosen[]>);
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
            message: "Invalid dosen ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const dosen = this.dosenService.getById(id);

      res.json({
        code: 200,
        data: dosen,
      } as SuccessResponse<Dosen>);
    } catch (error) {
      if ((error as Error).message === "Dosen not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Dosen not found",
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
      const { nip, name, username, password } = req.body as DosenCreateRequest;

      if (!nip || !name || !password) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "NIP, name, and password are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const dosenData = {
        nip,
        name,
        ...(username && { username }),
        password,
      };

      const createdDosen = await this.dosenService.create(dosenData);

      res.status(201).json({
        code: 201,
        data: createdDosen,
      } as SuccessResponse<Dosen>);
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
            message: "Invalid dosen ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { nip, name } = req.body as DosenUpdateRequest;

      const updateData: Partial<Dosen> = {};
      if (nip) updateData.nip = nip;
      if (name) updateData.name = name;

      const updatedDosen = await this.dosenService.update(id, updateData);

      res.json({
        code: 200,
        data: updatedDosen,
      } as SuccessResponse<Dosen>);
    } catch (error) {
      if ((error as Error).message === "Dosen not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Dosen not found",
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
            message: "Invalid dosen ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const deletedDosen = this.dosenService.delete(id);

      res.json({
        code: 200,
        data: deletedDosen,
      } as SuccessResponse<Dosen>);
    } catch (error) {
      if ((error as Error).message === "Dosen not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Dosen not found",
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
