type Env = "development" | "test" | "production";

import { Sequelize, DataTypes } from "sequelize";
import * as fs from "fs";
import * as path from "path";
import process from "process";
import logger from "../common/utils/logger";
import dbConfig from "../config/db.config";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV as Env;
const config = dbConfig[env];
const db: Record<string, any> = {};

let sequelize: Sequelize;

if (config.use_env_variable) {
  const databaseUrl = process.env[config.use_env_variable] || "";
  sequelize = new Sequelize(databaseUrl, config);
} else {
  sequelize = new Sequelize(
    config.database || "",
    config.username || "",
    config.password || undefined,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" ||
        file.endsWith(".model.ts") ||
        file.slice(-3) === ".js" ||
        file.endsWith(".model.js"))
    );
  })
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory.default(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    logger.verbose("Database & tables created!");
  })
  .catch((err: any) => {
    logger.error(`catch error in model/index.ts: ${err}`);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
