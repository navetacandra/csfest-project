import express, { type Express } from "express";

const SERVER_PORT: number = Number(process.env.PORT) || 5000;
const app: Express = express();

app.listen(SERVER_PORT, "127.0.0.1", () => {
  console.log(`Server was listening on port ${SERVER_PORT}`);
});
