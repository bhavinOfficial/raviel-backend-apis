import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import userService from "../services/user.service";
import { ApiResponse } from "../common/utils";

const userController = {
  registerUser: {
    validation: validator({
      body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string()
          .valid(...Object.values(enums.ROLE))
          .required(),
        mobile: Joi.string().required(),
      }),
    }),
    handler: async (req: Request, res: Response) => {
      const user = await userService.registerUser(req);

      if (!user)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      return ApiResponse.CREATED({
        res,
        message: "User created successfully.",
        payload: user,
      });
    },
  },

  loginUser: {
    validation: validator({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      }),
    }),
    handler: async (req: Request, res: Response) => {
      const result = await userService.loginUser(req, res);

      if (!result)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (result === message.USER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });

      if (result === message.INVALID_CREDENTIALS)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.INVALID_CREDENTIALS,
        });

      return ApiResponse.OK({
        res,
        message: "User logged in successfully.",
        payload: result,
      });
    },
  },

  updateUser: {
    validation: validator({
      body: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        mobile: Joi.string(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const user = await userService.updateUser(req);
      if (!user)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (user === message.USER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "User Updated successfully.",
        payload: user,
      });
    },
  },
  
  getLoggedInUserDetails: {
    validation: validator({}),
    handler: async (req: any, res: Response) => {
      const user = await userService.getLoggedInUserDetails(req);
      if (!user)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (user === message.USER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "User details fetched successfully.",
        payload: user,
      });
    },
  },
};

export default userController;
