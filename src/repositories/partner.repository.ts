import { Request } from "express";
import db from "../models";
import { Op } from "sequelize";

const partnerRepository = {
  partnerAddSellersViaForm: async (data: any) => {
    return await db.PartnerAddedSellers.create(data);
  },

  findSellerAddedByPartner: async (sellerId: string, partnerId: string) => {
    return await db.PartnerAddedSellers.findOne({
      where: {
        [Op.and]: [
          {
            sellerId: {
              [Op.eq]: sellerId
            },
          },
          {
            partnerId: {
              [Op.eq]: partnerId
            },
          }
        ]
      },
      raw: true
    });
  },

  updateSellerAddedByPartner: async (data: any, sellerId: string) => {
    const [updatedCount, [updatedSeller]] = await db.PartnerAddedSellers.update(data, {
      where: {
        sellerId,
      },
      raw: true,
      returning: true,
    });

    if (updatedCount) {
      return updatedSeller;
    } else {
      return null;
    }
  },

  deleteSellerAddedByPartner: async (sellerId: string) => {
    const deletedCount = await db.PartnerAddedSellers.destroy({
      where: {
        sellerId,
      },
    });

    if (deletedCount) {
      return true;
    } else {
      return false;
    }
  },

  fetchAllSellersAddedByPartner: async (partnerId: string) => {
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        partnerId,
      },
      raw: true
    });
    return fetchedSellers;
  },

  addSellersByPartnerUsingFile: async (dataToAdd: any) => {
    const addedSellers = await db.PartnerAddedSellers.bulkCreate(dataToAdd, {
      updateOnDuplicate: [
        "sellerName",
        "brandName",
        "launchingDate",
        "listingDate",
        "sellerEmailId",
        "phoneNumber",
        "password",
        "brandApproval",
        "gstNumber",
        "trademarkClass",
        "productCategories",
      ],
    });
    return addedSellers;
  },
};

export default partnerRepository;
