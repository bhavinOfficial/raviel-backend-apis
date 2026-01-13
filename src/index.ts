import express, { type Request, type Response } from "express";
import config from "./config/env.config";
import router from "./routes/index";
import db from "./models/index";
import { ApiResponse } from "./common/utils";
import errorHandler from "./middlewares/errorHandler.middleware";
import { SwaggerOptions, serve, setup } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://raviel.netlify.app", "https://raviel-partner-panel.netlify.app"],
  })
);

//* API routes path
const apiDir = path.join(__dirname, "routes");
const apiFiles = fs.readdirSync(apiDir);
const apiPaths = apiFiles.map((file) => path.join(apiDir, file));
//* Swagger Documentation
const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Raviel Backend APIs",
      description: "Raviel backend APIs documentation",
    },
    servers: [
      {
        url: config.swagger_url,
        description: `${
          config.node_env === "development" ? "Development" : "Production"
        } server`,
        default: true,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          name: "Authorization",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    produces: ["application/json"],
    consumes: ["application/json"],
  },
};

//* add apiPath to swaggerOptions
swaggerOptions.apis = apiPaths;

const swaggerDocs = swaggerJSDoc(swaggerOptions);

//* Swagger UI
app.use(
  "/api-docs",
  serve,
  setup(swaggerDocs, {
    customSiteTitle: "Raviel API Documentation",
  })
);

app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

//* API routes
app.use("/api/v1", router);

//* Error Handling
app.use(errorHandler);

//* Wrong Route
app.use(/.*/, (req: Request, res: Response) => {
  return ApiResponse.NOT_FOUND({
    res,
    message: `Oops! Looks like you're lost.`,
  });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database:", error);
  });
