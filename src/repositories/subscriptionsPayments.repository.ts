import { Request } from "express";
import db from "../models";

const subscriptionsPaymentsRepository = {
  createSubscriptionPaymentIntent: async (dataToAdd: any) => {
    return await db.UserSubscriptionsPayments.create(dataToAdd);
  },
  
  updateSubscriptionPaymentIntent: async (dataToUpdate: any, razorpayPaymentId: string) => {
    return await db.UserSubscriptionsPayments.update(dataToUpdate, {
      where: {
        razorpayPaymentId
      },
      raw: true,
      returning: true
    });
  },
};

export default subscriptionsPaymentsRepository;
