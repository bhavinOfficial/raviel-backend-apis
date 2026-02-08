import { Request } from "express";
import db from "../models";

const subscriptionRepository = {
  fetchSubscriptionPlans: async (req: Request) => {
    return await db.SubscriptionPlans.findAll({
      where: {
        ...(req.query.userType !== "all" && { userType: req.query.userType }),
        ...(req.query.userType !== "partner" && {
          planType: req.query.planType,
        }),
      },
      ...(req.query.userType !== "all" && { order: [["displayOrder", "ASC"]] }),
      include: [
        {
          model: db.SubscriptionPlanKeyFeatures,
          as: "subscriptionPlanKeyFeatures",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
        {
          model: db.SubscriptionPlanIncludedServices,
          as: "subscriptionPlanIncludedServices",
          required: false,
          order: [["displayOrder", "ASC"]],
        },
      ],
      // raw: true,
      // nest: true
    });
  },

  fetchSubscriptionPlan: async (req: Request) => {
    return await db.SubscriptionPlans.findOne({
      where: {
        id: req.body.subscriptionPlanId,
      },
      raw: true,
    });
  },

  fetchUserSubscription: async (subscriptionPlanId: string) => {
    return await db.UserSubscriptions.findOne({
      where: {
        razorpaySubscriptionId: subscriptionPlanId,
      },
      raw: true,
    });
  },

  deleteSubscription: async (req: Request) => {
    return await db.UserSubscriptions.destroy({
      where: {
        razorpaySubscriptionId: req.body.subscriptionPlanId,
      },
    });
  },
};

export default subscriptionRepository;
