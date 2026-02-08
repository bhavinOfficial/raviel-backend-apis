import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import { ApiResponse } from "../common/utils";
import partnerService from "../services/partner.service";

const partnerController = {
  partnerAddSellersViaForm: {
    validation: validator({
      body: Joi.object({
        sellerId: Joi.string().required(),
        sellerName: Joi.string().required(),
        brandName: Joi.string().required(),
        launchingDate: Joi.string().required(),
        listingDate: Joi.string().required(),
        sellerEmailId: Joi.string().email().required(),
        phoneNumber: Joi.string()
          .pattern(/^\d{10}$/)
          .required()
          .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits",
          }),
        password: Joi.string().required(),
        brandApproval: Joi.string().valid("pending", "approved").required(),
        gstNumber: Joi.string()
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
          .messages({
            "string.pattern.base": "Invalid GST number format",
          })
          .required(),
        trademarkClass: Joi.string().valid("pending", "approved").required(),
        productCategories: Joi.array()
          .items(
            Joi.string().valid(
              "Fashion",
              "Footwear",
              "Home & Kitchen",
              "Electronics",
              "Grocery",
              "Beauty",
              "Sports",
              "Toys",
              "Automobile",
              "Furniture",
              "Jewelry",
              "Books & Stationery",
              "Industrial & Scientific",
              "Pet Supplies",
              "Medical & Healthcare",
            ),
          )
          .min(1)
          .required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const addedsellerByPartner =
        await partnerService.partnerAddSellersViaForm(req);
      if (!addedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (addedsellerByPartner === message.SELLER_ALREADY_EXIST)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_ALREADY_EXIST,
        });
      return ApiResponse.CREATED({
        res,
        message: "Seller added by partner successfully",
        payload: {},
      });
    },
  },

  updateSellerAddedByPartner: {
    validation: validator({
      body: Joi.object({
        sellerName: Joi.string(),
        brandName: Joi.string(),
        launchingDate: Joi.string(),
        listingDate: Joi.string(),
        sellerEmailId: Joi.string().email(),
        phoneNumber: Joi.string()
          .pattern(/^\d{10}$/)
          .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits",
          }),
        password: Joi.string(),
        brandApproval: Joi.string().valid("pending", "approved"),
        gstNumber: Joi.string()
          .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
          .messages({
            "string.pattern.base": "Invalid GST number format",
          }),
        trademarkClass: Joi.string().valid("pending", "approved"),
        productCategories: Joi.array().items(
          Joi.string().valid(
            "Fashion",
            "Footwear",
            "Home & Kitchen",
            "Electronics",
            "Grocery",
            "Beauty",
            "Sports",
            "Toys",
            "Automobile",
            "Furniture",
            "Jewelry",
            "Books & Stationery",
            "Industrial & Scientific",
            "Pet Supplies",
            "Medical & Healthcare",
          ),
        ),
        dominantL1AtLaunch: Joi.string(),
        SKUsAtLaunch: Joi.number(),
        currentSKUsLive: Joi.number(),
      }),
      params: Joi.object({
        sellerId: Joi.string().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const updatedsellerByPartner =
        await partnerService.updateSellerAddedByPartner(req);
      if (!updatedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (updatedsellerByPartner === message.SELLER_NOT_FOUND)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "Seller updated successfully",
        payload: {},
      });
    },
  },

  deleteSellerAddedByPartner: {
    validation: validator({
      params: Joi.object({
        sellerId: Joi.string().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const deletedsellerByPartner =
        await partnerService.deleteSellerAddedByPartner(req);
      if (!deletedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (deletedsellerByPartner === message.SELLER_NOT_FOUND)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_NOT_FOUND,
        });
      return ApiResponse.OK({
        res,
        message: "Seller deleted successfully",
        payload: {},
      });
    },
  },

  fetchTopPerformerSellers: {
    validation: validator({
      query: Joi.object({
        sellerCount: Joi.number().default(5).required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchedTopSellers =
        await partnerService.fetchTopPerformerSellers(req);
      if (!fetchedTopSellers)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: "Top performer sellers fetched successfully",
        payload: fetchedTopSellers,
      });
    },
  },

  fetchSalesReport: {
    validation: validator({
      query: Joi.object({
        timeTenure: Joi.string()
          .valid("daily", "weekly", "annually")
          .default("daily")
          .required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchedSalesReport = await partnerService.fetchSalesReport(req);
      if (!fetchedSalesReport)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: "Sales report fetched successfully",
        payload: fetchedSalesReport,
      });
    },
  },

  fetchShipmentStatusWiseOrders: {
    validation: validator({
      query: Joi.object({
        sellerId: Joi.string().optional(),
        // sellerIds: Joi.array().items(Joi.string().uuid()).optional(),
        orderStatus: Joi.string()
          .valid(
            "DELIVERED",
            "CUSTOMER CANCELLED",
            "CANCELLED",
            "SELLER CANCELLED",
            "RETURNED",
            "REFUNDED",
            "RTO INITIATED",
            "RTO IN TRANSIT",
            "RTO COMPLETED",
            "PLACED",
            "SELLER PROCESSING",
            "BAG_PICKED",
            "BAG_PACKED",
            "DP_ASSIGNED",
            "OUT_FOR_PICKUP",
            "IN TRANSIT",
            "OUT FOR DELIVERY",
            "DELIVERY ATTEMPTED",
            "EDD_UPDATED",
            "BAG_PICK_FAILED",
            "REJECTED_BY_CUSTOMER",
            "BAG_LOST",
          )
          .required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchedOrders =
        await partnerService.fetchShipmentStatusWiseOrders(req);
      if (!fetchedOrders)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (fetchedOrders === message.SELLER_NOT_FOUND)
        return ApiResponse.NOT_FOUND({
          res,
          message: fetchedOrders,
        });
      return ApiResponse.OK({
        res,
        message: "Shipment status wise Orders fetched successfully",
        payload: fetchedOrders,
      });
    },
  },

  fetchAllSellersAddedByPartner: {
    validation: validator({
      query: Joi.object({
        sellerId: Joi.string().optional(),
        sellerName: Joi.string().optional(),
        sellerStatus: Joi.string().valid("active", "inactive").optional(),
        paymentByMonthYear: Joi.string()
          .pattern(/^\d{4}-\d{2}-01$/)
          .custom((value, helpers) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              return helpers.error("date.invalid");
            }
            return value;
          })
          .messages({
            "string.pattern.base": "Date must be in YYYY-MM-01 format",
            "date.invalid": "Invalid date",
          })
          .optional(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchsellersByPartner =
        await partnerService.fetchAllSellersAddedByPartner(req);
      if (!fetchsellersByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: `${!req.query?.sellerId ? "All sellers" : "Seller"} fetched successfully`,
        payload:
          req.query?.sellerId && !fetchsellersByPartner.length
            ? {}
            : fetchsellersByPartner,
      });
    },
  },

  fetchShipmentStatusReport: {
    validation: validator({
      // query: Joi.object({
      //   sellerIds: Joi.array().items(Joi.string().uuid()).optional(),
      // }),
      // query: Joi.object({
      //   sellerId: Joi.string().optional(),
      //   sellerName: Joi.string().optional(),
      //   sellerStatus: Joi.string().valid("active", "inactive").optional(),
      //   paymentByMonthYear: Joi.string()
      //     .pattern(/^\d{4}-\d{2}-01$/)
      //     .custom((value, helpers) => {
      //       const date = new Date(value);
      //       if (isNaN(date.getTime())) {
      //         return helpers.error("date.invalid");
      //       }
      //       return value;
      //     })
      //     .messages({
      //       "string.pattern.base": "Date must be in YYYY-MM-01 format",
      //       "date.invalid": "Invalid date",
      //     })
      //     .optional(),
      // }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchShipmentData =
        await partnerService.fetchShipmentStatusReport(req);
      if (!fetchShipmentData)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: "Shipment status wise data fetched successfully",
        payload: fetchShipmentData,
      });
    },
  },

  fetchCancelledOrHighReturnsSellersByPartner: {
    validation: validator({
      query: Joi.object({
        cancelledBySellers: Joi.boolean().required(),
        highReturnsSellers: Joi.boolean().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchFilteredsellersByPartner =
        await partnerService.fetchCancelledOrHighReturnsSellersByPartner(req);
      if (!fetchFilteredsellersByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: `${JSON.parse(req.query.cancelledBySellers) ? "Cancelled By" : ""}${JSON.parse(req.query.highReturnsSellers) ? "High returns" : ""} sellers fetched successfully`,
        payload: fetchFilteredsellersByPartner,
      });
    },
  },

  fetchAllOrdersByPartner: {
    validation: validator({
      query: Joi.object({
        sellerId: Joi.string().optional(),
        orderId: Joi.string().optional(),
        orderStatus: Joi.string()
          .valid(
            "DELIVERED",
            "CUSTOMER CANCELLED",
            "CANCELLED",
            "SELLER CANCELLED",
            "RETURNED",
            "REFUNDED",
            "RTO INITIATED",
            "RTO IN TRANSIT",
            "RTO COMPLETED",
            "PLACED",
            "SELLER PROCESSING",
            "BAG_PICKED",
            "BAG_PACKED",
            "DP_ASSIGNED",
            "OUT_FOR_PICKUP",
            "IN TRANSIT",
            "OUT FOR DELIVERY",
            "DELIVERY ATTEMPTED",
            "EDD_UPDATED",
            "BAG_PICK_FAILED",
            "REJECTED_BY_CUSTOMER",
            "BAG_LOST",
          )
          .optional(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchedOrders = await partnerService.fetchAllOrdersByPartner(req);
      if (!fetchedOrders)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: "Orders fetched successfully",
        payload: fetchedOrders,
      });
    },
  },

  fetchSellersOrderGrowthByPartner: {
    validation: validator({
      query: Joi.object({
        timeTenure: Joi.string()
          .valid("daily", "weekly", "annually")
          .default("daily")
          .required(),
      }),
      params: Joi.object({
        sellerId: Joi.string().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchedOrderGrowth =
        await partnerService.fetchSellersOrderGrowthByPartner(req);
      if (!fetchedOrderGrowth)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      return ApiResponse.OK({
        res,
        message: "Seller's order growth fetched successfully",
        payload: fetchedOrderGrowth,
      });
    },
  },

  addSellersByPartnerUsingFile: {
    validation: validator({}),
    handler: async (req: any, res: Response) => {
      const sellersAddedByPartner: any =
        await partnerService.addSellersByPartnerUsingFile(req);

      if (!sellersAddedByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      return ApiResponse.OK({
        res,
        message: `${sellersAddedByPartner?.sellerAddedWithValidData} sellers added successfully and for others sellers with invalid data you need to change their details and add them manually or via file upload!`,
        payload: {
          errorDatas: sellersAddedByPartner?.errorDatas,
        },
      });
    },
  },

  uploadTimelineDataManagementFile: {
    validation: validator({}),
    handler: async (req: any, res: Response) => {
      const addedFileData: any =
        await partnerService.uploadTimelineDataManagementFile(req);

      if (!addedFileData)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (typeof addedFileData === "string") {
        return ApiResponse.BAD_REQUEST({
          res,
          message: addedFileData,
        });
      }

      return ApiResponse.OK({
        res,
        message: `${req.body?.timelineDataTenure} File uploaded successfully`,
        payload: {},
      });
    },
  },

  confirmSellerPayment: {
    validation: validator({
      params: Joi.object({
        sellerId: Joi.string().required(),
      }),
      body: Joi.object({
        paymentType: Joi.string().valid("Fixed", "NMV").required(),
        isPaymentReceivedOrNot: Joi.bool().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const updatedSeller: any = await partnerService.confirmSellerPayment(req);

      if (!updatedSeller)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (typeof updatedSeller === "string") {
        return ApiResponse.BAD_REQUEST({
          res,
          message: updatedSeller,
        });
      }

      return ApiResponse.OK({
        res,
        message: "Seller payment confirmation updated successfully",
        payload: {},
      });
    },
  },

  fetchPartnerFileUploadPlaceholders: {
    validation: validator({
      query: Joi.object({
        fromDate: Joi.string().required(),
        toDate: Joi.string().required(),
      }),
    }),
    handler: async (req: any, res: Response) => {
      const fetchPlaceholderData: any =
        await partnerService.fetchPartnerFileUploadPlaceholders(req);

      if (!fetchPlaceholderData)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });

      if (typeof fetchPlaceholderData === "string") {
        return ApiResponse.BAD_REQUEST({
          res,
          message: fetchPlaceholderData,
        });
      }

      return ApiResponse.OK({
        res,
        message: "Fetched file upload placeholders successfully",
        payload: fetchPlaceholderData,
      });
    },
  },
};

export default partnerController;
