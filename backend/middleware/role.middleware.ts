import type { Request, Response, NextFunction } from "express";

export class RoleMiddleware {
  static requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: "Authentication required",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          code: 403,
          message: "Access forbidden: insufficient permissions",
        });
      }

      next();
    };
  };

  static requireAdmin = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: "Authentication required",
        });
      }

      if (req.user.role !== "admin") {
        return res.status(403).json({
          code: 403,
          message: "Access forbidden: admin role required",
        });
      }

      next();
    };
  };

  static requireDosen = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: "Authentication required",
        });
      }

      if (req.user.role !== "dosen") {
        return res.status(403).json({
          code: 403,
          message: "Access forbidden: dosen role required",
        });
      }

      next();
    };
  };

  static requireMahasiswa = () => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: "Authentication required",
        });
      }

      if (req.user.role !== "mahasiswa") {
        return res.status(403).json({
          code: 403,
          message: "Access forbidden: mahasiswa role required",
        });
      }

      next();
    };
  };
}
