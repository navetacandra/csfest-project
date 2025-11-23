import type { Request, Response } from "express";
import { PresenceService } from "../services/presence.service";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { Presence } from "../models/presence.model";

interface PresenceCreateRequest {
  classId: number;
  schedule_date: string;
  status: "hadir" | "sakit" | "izin" | "alpha";
  studentId?: number;
  late_time?: number;
}

export class PresenceController {
  private presenceService: PresenceService;

  constructor(sqlite: Sqlite) {
    this.presenceService = new PresenceService(sqlite);
  }

  async setPresence(req: Request, res: Response) {
    try {
      const { classId, schedule_date, status, studentId, late_time } =
        req.body as PresenceCreateRequest;

      if (!classId || !schedule_date || !status) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "classId, schedule_date, and status are required",
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

      const payload = {
        schedule_date,
        status,
        ...(studentId && { studentId: Number(studentId) }),
        ...(late_time && { late_time: Number(late_time) }),
      };

      const actor = {
        role: req.user.role as "mahasiswa" | "dosen",
        id: req.user.id,
      };

      const result = this.presenceService.setPresence(
        Number(classId),
        actor,
        payload,
      );

      res.status(200).json({
        code: 200,
        data: result,
      } as SuccessResponse<Presence>);
    } catch (error) {
      if ((error as Error).message.includes("can only set")) {
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

      if ((error as Error).message.includes("Student is not enrolled")) {
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

      if (req.user.role !== "mahasiswa") {
        return res.status(403).json({
          code: 403,
          error: {
            message: "Only mahasiswa can get presence recap",
            code: "FORBIDDEN_ACCESS",
          },
        } as ErrorResponse);
      }

      const { accumulated_late, recap } = this.presenceService.getRecap(
        req.user.id,
      );

      res.status(200).json({
        code: 200,
        data: {
          accumulated_late,
          recap,
        },
      } as SuccessResponse<{ accumulated_late: number; recap: Presence[] }>);
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
