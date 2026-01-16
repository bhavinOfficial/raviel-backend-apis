import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import { ApiResponse } from "../common/utils";
import subscriptionPlansService from "../services/subscriptionPlans.service";

const subscriptionPlansController = {
  fetchSubscriptionPlans: {
    validation: validator({
      query: Joi.object({
        userType: Joi.string().valid("partner", "seller", "all").default("partner"),
        planType: Joi.string().valid("monthly", "quarterly", "half-yearly", "yearly").default("monthly"),
      })
    }),
    handler: async (req: any, res: Response) => {
      const fetchedSubscriptionPlans = await subscriptionPlansService.fetchSubscriptionPlans(req);
      if (!fetchedSubscriptionPlans)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      return ApiResponse.OK({
        res,
        message: "Subscription plans fetched successfully.",
        payload: fetchedSubscriptionPlans,
      });
    },
  },

};

export default subscriptionPlansController;
