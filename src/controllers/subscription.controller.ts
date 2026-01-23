import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import { ApiResponse } from "../common/utils";
import subscriptionService from "../services/subscriptions.service";
import crypto from "crypto";
import config from "../config/env.config";

const subscriptionController = {
  fetchSubscriptionPlans: {
    validation: validator({
      query: Joi.object({
        userType: Joi.string().valid("partner", "seller", "all").default("partner"),
        planType: Joi.string().valid("monthly", "quarterly", "half-yearly", "yearly").default("monthly"),
      })
    }),
    handler: async (req: any, res: Response) => {
      const fetchedSubscriptionPlans = await subscriptionService.fetchSubscriptionPlans(req);
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

  createSubscription: {
    validation: validator({
      body: Joi.object({
        subscriptionPlanId: Joi.string().required(),
      })
    }),
    handler: async (req: any, res: Response) => {
      const createdSubscription = await subscriptionService.createSubscription(req);
      if (!createdSubscription)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (typeof createdSubscription === "string")
        return ApiResponse.BAD_REQUEST({
          res,
          message: createdSubscription,
        });

      return ApiResponse.OK({
        res,
        message: "Subscription created successfully.",
        payload: createdSubscription,
      });
    },
  },

  verifyPayment: {
    validation: validator({
      body: Joi.object({
        razorpay_payment_id: Joi.string().required(),
        razorpay_signature: Joi.string().required(),
        razorpay_subscription_id: Joi.string().required(),
      })
    }),
    handler: async (req: any, res: Response) => {
      const paymentVerification = await subscriptionService.verifyPayment(req);
      if (!paymentVerification)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (typeof paymentVerification === "string")
        return ApiResponse.BAD_REQUEST({
          res,
          message: paymentVerification,
        });
      return ApiResponse.OK({
        res,
        message: "Payment verification successfully.",
        payload: {},
      });
    },
  },

  razorpayWebhook: {
    validation: validator({}),
    handler: async (req: any, res: Response) => {
      const signature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", config.razorpay_key_secret)
        .update(req.body)
        .digest("hex");

      if (signature !== expectedSignature) {
        return ApiResponse.BAD_REQUEST({
          res,
          message: "Invalid signature",
        });
      } 

      const event = JSON.parse(req.body.toString());

      const handleEvents = await subscriptionService.handleRazorpayWebhookEvents(event);

      return ApiResponse.OK({
        res,
        message: "Webhook executed successfully.",
        payload: {},
      });
    },
  },

};

export default subscriptionController;
