import express, { type Express } from "express";
import { Sqlite } from "./config/database";

const SERVER_PORT: number = parseInt(process.env.PORT ?? "") || 5000;
const sqlite: Sqlite = new Sqlite(process.env.DB_NAME);
const app: Express = express();

app.listen(SERVER_PORT, "127.0.0.1", () => {
  console.log(`Server was listening on port ${SERVER_PORT}`);
});
