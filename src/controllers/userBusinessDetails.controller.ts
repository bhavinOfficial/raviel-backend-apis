import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import userBusinessDetailsService from "../services/userBusinessDetails.service";
import { ApiResponse } from "../common/utils";

const userBusinessDetailsController = {
  createUserBusinessDetails: {
    validation: validator({
      body: Joi.object({
        role: Joi.string().valid(...Object.values(enums.ROLE)).required(),
        businessName: Joi.string().required(),
        gstNumber: Joi.string().when("role", {
          is: "seller",
          then: Joi.string()
            .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
            .required()
            .messages({
              "string.pattern.base": "Invalid GST number format",
            }),
          otherwise: Joi.optional(),
        }),
        gstAddress: Joi.string().when("role", {
          is: "seller",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        manufacturerNumber: Joi.string().when("role", {
          is: "seller",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        fullFillerNumber: Joi.string().when("role", {
          is: "seller",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        pickupAddress: Joi.string().when("role", {
          is: "seller",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        businessType: Joi.string().when("role", {
          is: "seller",
          then: Joi.required(),
          otherwise: Joi.optional(),
        }),
        managerPhoneNumber: Joi.string().pattern(/^\d{10}$/)
          .messages({
            "string.pattern.base": "Invalid manager phone number format",
          }).allow("", null).optional(),
        managerEmail: Joi.string().email().allow("", null).optional(),
        pancardNumber: Joi.string().when("role", {
          is: "seller",
          then: Joi.string()
            .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
            .required()
            .messages({
              "string.pattern.base": "Invalid PAN card number format",
            }),
          otherwise: Joi.optional(),
        }),
      }),
    }),
    handler: async (req: any, res: Response) => {
      if (req.body.role !== req.user.role) {
        return ApiResponse.BAD_REQUEST({
          res,
          message: "Invalid role passed!",
        });
      }
      const createdUserBusinessDetails = await userBusinessDetailsService.createUserBusinessDetails(req);
      if (!createdUserBusinessDetails)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (createdUserBusinessDetails === "User already completed onboarding!")
        return ApiResponse.BAD_REQUEST({
          res,
          message: createdUserBusinessDetails,
        });
      if (createdUserBusinessDetails === message.USER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });
      return ApiResponse.CREATED({
        res,
        message: "User onboading completed successfully.",
        payload: {},
      });
    },
  },

  updateUserBusinessDetails: {
    validation: validator({
      body: Joi.object({
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
          }).allow("", null).optional(),
        managerPhoneNumber: Joi.string().pattern(/^\d{10}$/)
          .messages({
            "string.pattern.base": "Invalid manager phone number format",
          }).allow("", null).optional(),
        managerEmail: Joi.string().email().optional(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const updatedUserBusinessDetails = await userBusinessDetailsService.updateUserBusinessDetails(req);
      if (!updatedUserBusinessDetails)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (updatedUserBusinessDetails === message.USER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: message.USER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "User business details updated successfully.",
        payload: {},
      });
    },
  },
};

export default userBusinessDetailsController;
