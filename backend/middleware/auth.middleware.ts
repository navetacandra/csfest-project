import type { Request, Response, NextFunction } from "express";
import { JWT } from "../services/jwt.service";
import { UserRepository } from "../repositories/user.repository";
import { sqlite } from "../config/database";

interface DecodedToken {
  id: number;
  username: string;
  role: "mahasiswa" | "dosen" | "admin";
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: "mahasiswa" | "dosen" | "admin";
      };
    }
  }
}

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const userRepository: UserRepository = new UserRepository(sqlite);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        code: 401,
        message: "Access token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Access token is required",
      });
    }

    if (!JWT.verify(token)) {
      return res.status(401).json({
        code: 401,
        message: "Invalid or expired token",
      });
    }

    try {
      const decoded = JWT.decode<DecodedToken>(token);

      if (!decoded || !decoded.id || !decoded.role) {
        return res.status(401).json({
          code: 401,
          message: "Invalid token payload",
        });
      }

      const user = userRepository.findById(decoded.id, decoded.role);
      if (!user) {
        return res.status(401).json({
          code: 401,
          message: "User no longer exists",
        });
      }

      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        code: 401,
        message: "Invalid token",
      });
    }
  }

  static authorize(roles: ("mahasiswa" | "dosen" | "admin")[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          code: 401,
          message: "Authentication required",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          code: 403,
          message: `Access denied. Required roles: ${roles.join(", ")}`,
        });
      }

      next();
    };
  }
}
