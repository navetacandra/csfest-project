import type { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Admin } from "../models/admin.model";

interface AdminCreateRequest {
  name: string;
  username: string;
  password: string;
}

interface AdminUpdateRequest {
  name?: string;
  username?: string;
}

export class AdminController {
  private adminService: AdminService;

  constructor(sqlite: Sqlite) {
    this.adminService = new AdminService(sqlite);
  }

  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const parsedPage = Number(page);
      const parsedLimit = Number(limit);

      const allAdmins = this.adminService.getAll(parsedPage, parsedLimit);

      const totalData = allAdmins.length;
      const totalPages = Math.ceil(totalData / parsedLimit);

      res.json({
        code: 200,
        data: allAdmins,
        meta: {
          size: allAdmins.length,
          page: parsedPage,
          limit: parsedLimit,
          totalData: totalData,
          totalPage: totalPages,
        },
      } as SuccessResponse<Admin[]>);
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
            message: "Invalid admin ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const admin = this.adminService.getById(id);

      res.json({
        code: 200,
        data: admin,
      } as SuccessResponse<Admin>);
    } catch (error) {
      if ((error as Error).message === "Admin not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Admin not found",
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
      const { name, username, password } = req.body as AdminCreateRequest;

      if (!name || !username || !password) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Name, username, and password are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const adminData = {
        name,
        username,
        password,
      };

      const createdAdmin = await this.adminService.create(adminData);

      res.status(201).json({
        code: 201,
        data: createdAdmin,
      } as SuccessResponse<Admin>);
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
            message: "Invalid admin ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const { name, username } = req.body as AdminUpdateRequest;

      const updateData: Partial<Admin> = {};
      if (name) updateData.name = name;
      if (username) updateData.username = username;

      const updatedAdmin = await this.adminService.update(id, updateData);

      res.json({
        code: 200,
        data: updatedAdmin,
      } as SuccessResponse<Admin>);
    } catch (error) {
      if ((error as Error).message === "Admin not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Admin not found",
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
            message: "Invalid admin ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const deletedAdmin = this.adminService.delete(id);

      res.json({
        code: 200,
        data: deletedAdmin,
      } as SuccessResponse<Admin>);
    } catch (error) {
      if ((error as Error).message === "Admin not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "Admin not found",
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
