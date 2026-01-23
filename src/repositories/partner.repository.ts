import { Request } from "express";
import db from "../models";
import { Op } from "sequelize";

const partnerRepository = {
  partnerAddSellersViaForm: async (data: any) => {
    return await db.PartnerAddedSellers.create(data);
  },

  sellerOrdersAddedByPartnerUsingFile: async (data: any) => {
    return await db.PartnerSellersOrders.bulkCreate(data, {
      updateOnDuplicate: [
        // "sellerId",
        "orderCreatedDate",
        // "orderId",
        // "shipmentId",
        "shipmentStatus",
        "orderValue",
        "deliveryPartner",
        "modeOfPayment",
        "orderShipped",
      ],
    });
  },

  findSellerAddedByPartner: async (sellerId: string, partnerId: string) => {
    return await db.PartnerAddedSellers.findOne({
      where: {
        [Op.and]: [
          {
            id: {
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
        id: sellerId,
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
        id: sellerId,
      },
    });

    if (deletedCount) {
      return true;
    } else {
      return false;
    }
  },

  fetchAllSellersAddedByPartner: async (req: any) => {
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        partnerId: req.user?.id,
        ...(req.query?.sellerId && {
          id: { [Op.iLike]: `%${req.query?.sellerId}%` }
        }),
        ...(req.query?.sellerName && {
          sellerName: { [Op.iLike]: `%${req.query?.sellerName}%` }
        }),
        ...(req.query.paymentByMonthYear && {
          [Op.or]: [
            {
              fixedPaymentMonthYear: {
                [Op.eq]: req.query.paymentByMonthYear
              }
            },
            {
              NMVPaymentMonthYear: {
                [Op.eq]: req.query.paymentByMonthYear
              }
            }
          ]
        })
      },
      raw: true
    });
    return fetchedSellers;
  },

  fetchAllOrdersByPartner: async (req: any) => {
    const fetchedOrders = await db.PartnerSellersOrders.findAll({
      where: {
        partnerId: req.user?.id,
        ...(req.query?.sellerId && {
          sellerId: req.query?.sellerId
        }
        ),
        ...(req.query?.orderId && {
          id: req.query?.orderId
        }
        ),
      },
      raw: true
    });
    return fetchedOrders;
  },

  fetchAllSellersBySellerIds: async (sellerIds: string[]) => {
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        sellerId: sellerIds,
      },
      raw: true
    });
    return fetchedSellers;
  },

  createOrUpdateBulkSellers: async (dataToAdd: any) => {
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
        "sellerEmailId",
        "sellerStatus",
        "dominantL1AtLaunch",
        "SKUsAtLaunch",
        "currentSKUsLive",
        "fixedPaymentAmount",
        "fixedPaymentMonthYear",
        "NMVPaymentAmount",
        "NMVPaymentMonthYear"
      ],
    });
    return addedSellers;
  },
};

export default partnerRepository;
