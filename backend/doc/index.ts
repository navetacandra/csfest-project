import { Router } from "express";
import swaggerUi from "swagger-ui-express";

const yamlFile = await Bun.file(`${process.cwd()}/openapi.yaml`).text();
const docRouter: Router = Router();
const swaggerDoc = Bun.YAML.parse(yamlFile);

docRouter.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc as swaggerUi.JsonObject),
);

export { docRouter };
