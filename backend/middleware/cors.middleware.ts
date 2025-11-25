import type { Request, Response, NextFunction } from "express";

const SERVER_PORT: number = parseInt(Bun.env.PORT || "5000");
const corsWhitelist = [
  `http://localhost:${SERVER_PORT}`, // self
  "http://localhost:5173", // vite dev
  "http://localhost:4173", // vite preview
  "http://naveta.local", // my local
  "https://naveta.local", // my local
  "https://kulmsin.juraganweb.web.id", // prod
];

export function cors(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );

  if (req.method === "OPTIONS") {
    const origin = req.headers.origin || "";
    if (Bun.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      return res.sendStatus(204);
    }

    if (!origin || corsWhitelist.includes(origin)) {
      origin && res.setHeader("Access-Control-Allow-Origin", origin);
      return res.sendStatus(204);
    }

    return res.sendStatus(418);
  }

  const origin = req.headers.origin || "";
  if (Bun.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    return next();
  }

  if (!origin || corsWhitelist.includes(origin)) {
    origin && res.setHeader("Access-Control-Allow-Origin", origin);
    return next();
  }

  return res.sendStatus(418);
}
