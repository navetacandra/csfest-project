import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor(sqlite: Sqlite) {
    this.dashboardService = new DashboardService(sqlite);
  }

  async getDashboard(req: Request, res: Response) {
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

      const dashboardData = await this.dashboardService.getDashboardData(
        req.user.id,
        req.user.role,
      );

      res.status(200).json({
        code: 200,
        data: dashboardData,
      } as SuccessResponse<any>);
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