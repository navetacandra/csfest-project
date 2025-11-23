import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import apiRouter from "./routes";
import storageRoute from "./routes/storage.route";
import compression from "compression";

const SERVER_PORT: number = parseInt(Bun.env.PORT || "5000");
const app: Express = express();

const corsWhitelist = [
  `http://localhost:${SERVER_PORT}`, // self
  "http://localhost:5173", // vite dev
  "http://localhost:4173", // vite preview
  "http://naveta.local", // my local
  "https://naveta.local", // my local
  "https://kulmsin.juraganweb.web.id", // prod
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (Bun.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  }

  const origin = req.headers.origin;
  if (!origin || corsWhitelist.includes(origin)) {
    origin && res.setHeader("Access-Control-Allow-Origin", origin);
    return next();
  }
  return res.sendStatus(418); // teapot
});

app.use("/api", apiRouter);
app.use("/storage", storageRoute);

if (import.meta.main) {
  app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`Server was listening on port ${SERVER_PORT}`);
  });
}

export { app };
