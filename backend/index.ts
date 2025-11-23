import express, { type Express, type NextFunction } from "express";
import apiRouter from "./routes";
import storageRoute from "./routes/storage.route";
import cors from "cors";
import compression from "compression";

const SERVER_PORT: number = Bun.env.PORT || 5000;
const app: Express = express();

let corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<cors.CorsRequest> =
  { credentials: true };
if (Bun.env.NODE_ENV === "production") {
  corsOptions = {
    origin: (origin, callback) => {
      if (!origin) callback(null, !origin);
      else callback(new Error("Blocked by cors"));
    },
    credentials: true,
  };
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors(corsOptions));

app.use("/api", apiRouter);
app.use("/storage", storageRoute);

if (import.meta.main) {
  app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`Server was listening on port ${SERVER_PORT}`);
  });
}

export { app };
