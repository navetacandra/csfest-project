import express, { type Express } from "express";
import apiRouter from "./routes";
import cors from "cors";
import compression from "compression";
import { sqlite } from "./config/database";

const SERVER_PORT: number = Bun.env.PORT || 5000;
const app: Express = express();

let corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<cors.CorsRequest> =
  { origin: "*", credentials: true };
if (Bun.env.NODE_ENV === "production") {
  corsOptions = { origin: true, credentials: true };
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors(corsOptions));

app.use("/api", apiRouter);

if (import.meta.main) {
  app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`Server was listening on port ${SERVER_PORT}`);
  });
}

export { app };
