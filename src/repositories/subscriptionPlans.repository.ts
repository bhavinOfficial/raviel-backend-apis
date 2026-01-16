import { Request } from "express";
import db from "../models";

const subscriptionPlansRepository = {
  fetchSubscriptionPlans: async (req: Request) => {
    return await db.SubscriptionPlans.findAll({
      where: {
        ...(req.query.userType !== "all" && { userType: req.query.userType }),
        planType: req.query.planType
      },
      ...(req.query.userType !== "all" && { order: [[ "displayOrder", "ASC"  ]] }),
      raw: true,
      nest: true
    });
  },
};

export default subscriptionPlansRepository;
