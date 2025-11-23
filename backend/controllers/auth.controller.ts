import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { MahasiswaService } from "../services/mahasiswa.service";
import { DosenService } from "../services/dosen.service";
import { AdminService } from "../services/admin.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Mahasiswa } from "../models/mahasiswa.model";
import type { Dosen } from "../models/dosen.model";
import type { Admin } from "../models/admin.model";

interface LoginResponse {
  token: string;
  role: "mahasiswa" | "dosen" | "admin";
}

type ProfileResponse = {
  id: number;
  username: string;
} & (
  | ({ role: "mahasiswa" } & Mahasiswa)
  | ({ role: "dosen" } & Dosen)
  | ({ role: "admin" } & Admin)
);

export class AuthController {
  private authService: AuthService;
  private mahasiswaService: MahasiswaService;
  private dosenService: DosenService;
  private adminService: AdminService;

  constructor(sqlite: Sqlite) {
    this.authService = new AuthService(sqlite);
    this.mahasiswaService = new MahasiswaService(sqlite);
    this.dosenService = new DosenService(sqlite);
    this.adminService = new AdminService(sqlite);
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Username and password are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const result = await this.authService.login(username, password);

      res.status(200).json({
        code: 200,
        data: {
          token: result.token,
          role: result.role,
        },
      } as SuccessResponse<LoginResponse>);
    } catch (error) {
      res.status(401).json({
        code: 401,
        error: {
          message: (error as Error).message || "Invalid username or password",
          code: "AUTHENTICATION_FAILED",
        },
      } as ErrorResponse);
    }
  }

  async getProfile(req: Request, res: Response) {
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

      let userData: Mahasiswa | Dosen | Admin | null = null;
      switch (req.user.role) {
        case "mahasiswa":
          userData = await this.mahasiswaService.getById(req.user.id);
          break;
        case "dosen":
          userData = await this.dosenService.getById(req.user.id);
          break;
        case "admin":
          userData = await this.adminService.getById(req.user.id);
          break;
        default:
          return res.status(400).json({
            code: 400,
            error: {
              message: "Unknown user role",
              code: "VALIDATION_ERROR",
            },
          } as ErrorResponse);
      }

      if (!userData) {
        return res.status(404).json({
          code: 404,
          error: {
            message: "User not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      res.status(200).json({
        code: 200,
        data: {
          role: req.user.role,
          ...userData,
        },
      } as SuccessResponse<ProfileResponse>);
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

  async logout(req: Request, res: Response) {
    res.status(200).json({
      code: 200,
      data: {},
    } as SuccessResponse<{}>);
  }
}
