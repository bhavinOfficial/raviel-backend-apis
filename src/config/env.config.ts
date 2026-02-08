import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import logger from "../common/utils/logger";

// const envPath = path.resolve(process.cwd(), `.${process.env.NODE_ENV}.env`);
const envPath = path.resolve(process.cwd(), `.env`);
dotenv.config({ path: envPath });

//* get the intended host and port number, use localhost and port 3000 if not provided
const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().required().description("Backend Port"),
    NODE_ENV: Joi.string().required().description("Node Environment"),
    DB_HOST: Joi.string().description("Database host name"),
    DB_PORT: Joi.number().description("Database port"),
    DB_NAME: Joi.string().description("Database name"),
    DB_USERNAME: Joi.string().description("Database user name"),
    DB_SCHEMA: Joi.string().description("Database user schema"),
    DB_PASSWORD: Joi.string().description("Database password"),
    JWT_SECRET_KEY: Joi.string().required().description("JWT secret key"),
    SWAGGER_URL: Joi.string().required().description("Swagger API URL"),
    DATABASE_URL: Joi.string().required().description("Database url"),
    CRYPTO_SECRET_KEY: Joi.string().required().description("Crypto secret key"),
    RAZORPAY_KEY_ID: Joi.string().required().description("Razorpay Key ID"),
    RAZORPAY_KEY_SECRET: Joi.string()
      .required()
      .description("Razorpay Key Secret"),
    RAZORPAY_WEBHOOK_SECRET: Joi.string()
      .required()
      .description("Razorpay webhook Secret"),
    // JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
    //   .default(30)
    //   .description("minutes after which access tokens expire"),
    // JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
    //   .default(30)
    //   .description("days after which refresh tokens expire"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  logger.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

//* Export the config object based on the NODE_ENV
const config = {
  port: envVars.PORT,
  node_env: envVars.NODE_ENV,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_name: envVars.DB_NAME,
  db_username: envVars.DB_USERNAME,
  db_schema: envVars.DB_SCHEMA,
  db_password: envVars.DB_PASSWORD,
  db_url: envVars.DATABASE_URL,
  jwt: {
    secret: envVars.JWT_SECRET_KEY,
    // accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    // refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    // resetPasswordExpirationMinutes: 10,
  },
  swagger_url: envVars.SWAGGER_URL,
  crypto_secret_key: envVars.CRYPTO_SECRET_KEY,
  razorpay_key_id: envVars.RAZORPAY_KEY_ID,
  razorpay_key_secret: envVars.RAZORPAY_KEY_SECRET,
  razorpay_webhook_secret: envVars.RAZORPAY_WEBHOOK_SECRET,
};

export default config;
