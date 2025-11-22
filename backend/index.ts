import express, { type Express } from "express";
import apiRouter from "./routes";
import storageRoute from "./routes/storage.route";
import { Sqlite } from "./config/database";

const SERVER_PORT: number = parseInt(process.env.PORT ?? "") || 5000;
export const sqlite: Sqlite = new Sqlite(process.env.DB_NAME);
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", apiRouter);
// app.use("/storage", storageRoute);

app.listen(SERVER_PORT, "0.0.0.0", () => {
  console.log(`Server was listening on port ${SERVER_PORT}`);
});
