import { Request } from "express";
import db from "../models";

const userSubscriptionRepository = {
  createUserSubscription: async (dataToAdd: any) => {
    return await db.UserSubscriptions.create(dataToAdd);
  },

  fetchUserSubscription: async (razorpaySubscriptionId: string) => {
    return await db.UserSubscriptions.findOne({
      where: {
        razorpaySubscriptionId,
      },
      raw: true,
    });
  },

  updateUserSubscription: async (
    dataToUpdate: any,
    userSubscriptionId: string,
  ) => {
    return await db.UserSubscriptions.update(dataToUpdate, {
      where: {
        id: userSubscriptionId,
      },
      raw: true,
      returning: true,
    });
  },

  upsertUserSubscription: async (dataToUpdate: any) => {
    return await db.UserSubscriptions.update(dataToUpdate, {
      conflictFields: ["id"],
      returning: true,
    });
  },
};

export default userSubscriptionRepository;
