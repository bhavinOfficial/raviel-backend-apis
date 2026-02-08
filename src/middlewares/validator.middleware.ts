import { Response, NextFunction } from "express";
import ApiResponse from "../common/utils/apiResponse";
import logger from "../common/utils/logger";

export const validator = (schema: any) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const paths = Object.keys(schema);
    if (!paths.length) return next();
    if (
      !paths.includes("body") &&
      !paths.includes("query") &&
      !paths.includes("params")
    )
      return next();

    for (let path of paths) {
      const dataForValidation = req[path];
      const { value, error } = schema[path].validate(dataForValidation, {
        allowUnknown: false,
        stripUnknown: true,
      });

      if (error) {
        logger.error(`VALIDATION ERROR: ${error}`);
        const context = error?.details;

        return ApiResponse.BAD_REQUEST({
          res,
          message: `Validation failed for ${path}.`,
          payload: {
            accepted_fields: Object.keys(schema[path].describe().keys),
            context,
          },
        });
      }
      if (path === "query") {
        Object.assign(req.query, value);
      } else {
        req[path] = value;
      }
    }
    next();
  };
};
