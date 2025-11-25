import express, { type Express } from "express";
import apiRouter from "./routes";
import storageRoute from "./routes/storage.route";
import compression from "compression";
import { cors } from "./middleware/cors.middleware";

const SERVER_PORT: number = parseInt(Bun.env.PORT || "5000");
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(cors);

app.use("/api", apiRouter);
app.use("/storage", storageRoute);

if (import.meta.main) {
  app.listen(SERVER_PORT, "0.0.0.0", () => {
    console.log(`Server was listening on port ${SERVER_PORT}`);
  });
}

export { app };
