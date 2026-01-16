import { Request, Response } from "express";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import subscriptionPlansRepository from "../repositories/subscriptionPlans.repository";

const subscriptionPlansService = {
  fetchSubscriptionPlans: async (req: Request) => {
    const fetchedPlans = await subscriptionPlansRepository.fetchSubscriptionPlans(req);

    if (!fetchedPlans) return message.FAILED;

    const senitizedData: any = {};

    if (req.query.userType === "partner") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "seller") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "all") {
      senitizedData.partnerPlans = fetchedPlans.filter((plan: any) => plan.userType === "partner").sort((planA: any, planB: any) => planA.displayOrder - planB.displayOrder);
      senitizedData.sellerPlans = fetchedPlans.filter((plan: any) => plan.userType === "seller").sort((planA: any, planB: any) => planA.displayOrder - planB.displayOrder);
    }

    return senitizedData;
  },

};

export default subscriptionPlansService;
