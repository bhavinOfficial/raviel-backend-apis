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
        password: Joi.string()
          .min(6)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/)
          .required()
          .messages({
            "string.pattern.base":
              "Password must contain at least one uppercase letter, one lowercase letter, and one special character",
          }),
        role: Joi.string()
          .valid(...Object.values(enums.ROLE))
          .required(),
        phoneNumber: Joi.string()
          .pattern(/^\d{10}$/)
          .required()
          .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits",
          }),
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
        phoneNumber: Joi.string()
          .pattern(/^\d{10}$/)
          .required()
          .messages({
            "string.pattern.base": "Phone number number must be exactly 10 digits",
          }),
        businessName: Joi.string().optional(),
        gstNumber: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
          .messages({
            "string.pattern.base": "Invalid GST number format",
          }).optional(),
        gstAddress: Joi.string().optional(),
        manufacturerNumber: Joi.string().optional(),
        fullFillerNumber: Joi.string().optional(),
        pickupAddress: Joi.string().optional(),
        businessType: Joi.string().optional(),
        pancardNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
          .messages({
            "string.pattern.base": "Invalid PAN card number format",
          }).optional(),
        managerPhoneNumber: Joi.string().pattern(/^\d{10}$/)
          .messages({
            "string.pattern.base": "Invalid manager phone number format",
          }).allow("", null).optional(),
        managerEmail: Joi.string().email().allow("", null).optional(),
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
        payload: {},
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
