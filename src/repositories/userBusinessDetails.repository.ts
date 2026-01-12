import { Request } from "express";
import db from "../models";

const userBusinessDetailsRepository = {
  createUserBusinessDetails: async (data: any) => {
    return await db.UserBusinessDetails.create(data);
  },

  updateUserBusinessDetails: async (data: any, userId: string) => {
    const [updatedCount, [updatedUserBusinessDetails]] = await db.UserBusinessDetails.update(data, {
      where: {
        userId: userId,
      },
      raw: true,
      returning: true,
    });

    if (updatedCount) {
      return updatedUserBusinessDetails;
    } else {
      return null;
    }
  },
};

export default userBusinessDetailsRepository;
