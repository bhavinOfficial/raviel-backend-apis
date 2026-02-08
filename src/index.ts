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
import userSubscriptionRepository from "./repositories/userSubscriptions.repository";
import { startCronJobs } from "./cron";

const app = express();
const port = config.port;

app.use(
  "/api/v1/subscriptions/razorpay/webhooks",
  express.raw({ type: "application/json" }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://raviel.in",
      "https://www.raviel.in",
      "https://partner.raviel.in",
    ],
  }),
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
  }),
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
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // 🔥 IMPORTANT: increase server timeout (fixes Axios timeout issue)
    server.setTimeout(120000); // 2 minutes

    // 🔥 START CRON JOBS
    startCronJobs();
  })
  .catch((error: any) => {
    console.error("Unable to connect to the database:", error);
  });
