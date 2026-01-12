import { Request } from "express";
import db from "../models";
import { Op } from "sequelize";

const partnerRepository = {
  partnerAddSellersViaForm: async (data: any) => {
    return await db.PartnerAddedSellers.create(data);
  },

  findSellerAddedByPartner: async (sellerId: string) => {
    return await db.PartnerAddedSellers.findOne({
      where: {
        sellerId: {
          [Op.eq]: sellerId
        }
      },
      raw: true
    });
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

export default partnerRepository;
