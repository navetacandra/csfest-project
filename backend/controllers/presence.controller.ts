import type { Request, Response } from "express";
import { PresenceService } from "../services/presence.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";

type PresenceData = {
  schedule_date: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
  studentId?: number;
  late_time?: number;
};

type PresenceCreateRequest = PresenceData | PresenceData[];

export class PresenceController {
  private presenceService: PresenceService;

  constructor(sqlite: Sqlite) {
    this.presenceService = new PresenceService(sqlite);
  }

  async setPresence(req: Request, res: Response) {
    try {
      const { class_id } = req.params;
      const payload = req.body as PresenceCreateRequest;

      if (!class_id) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "class_id is required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if (!req.user) {
        return res.status(401).json({
          code: 401,
          error: {
            message: "Authentication required",
            code: "UNAUTHORIZED",
          },
        } as ErrorResponse);
      }

      const actor = {
        role: req.user.role as "mahasiswa" | "dosen",
        id: req.user.id,
      };

      const result = this.presenceService.setPresence(
        Number(class_id),
        actor,
        payload,
      );

      res.status(200).json({
        code: 200,
        data: result,
      } as SuccessResponse<any>);
    } catch (error) {
      if (
        (error as Error).message.includes("can only set") ||
        (error as Error).message.includes("must provide an array")
      ) {
        return res.status(400).json({
          code: 400,
          error: {
            message: (error as Error).message,
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      if ((error as Error).message.includes("not found")) {
        return res.status(404).json({
          code: 404,
          error: {
            message: (error as Error).message,
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      if (
        (error as Error).message.includes("is not enrolled") ||
        (error as Error).message.includes("studentId is required")
      ) {
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

  async getRecap(req: Request, res: Response) {
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

      let data;
      if (req.user.role === "mahasiswa") {
        data = this.presenceService.getMahasiswaRecap(req.user.id);
      } else if (req.user.role === "dosen") {
        const { class_id } = req.params;
        data = this.presenceService.getDosenRecap(Number(class_id));
      } else {
        return res.status(403).json({
          code: 403,
          error: {
            message: "Forbidden access",
            code: "FORBIDDEN_ACCESS",
          },
        } as ErrorResponse);
      }

      res.status(200).json({
        code: 200,
        data: data,
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
