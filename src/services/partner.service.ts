import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import partnerRepository from "../repositories/partner.repository";
import xlsx from "xlsx";
import fs from "fs";

const partnerService = {
  partnerAddSellersViaForm: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(
      req.body.sellerId,
      req.user.id,
    );

    if (seller) return message.SELLER_ALREADY_EXIST;

    const dataToCreate = {
      ...req.body,
      partnerId: req.user.id,
    };

    const createdSelller =
      await partnerRepository.partnerAddSellersViaForm(dataToCreate);

    if (!createdSelller) return message.FAILED;

    return createdSelller;
  },

  updateSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(
      req.params.sellerId,
      req.user.id,
    );

    if (!seller) return message.SELLER_NOT_FOUND;

    const updatedSelller = await partnerRepository.updateSellerAddedByPartner(
      req.body,
      req.params.sellerId,
    );

    if (!updatedSelller) return message.FAILED;

    return updatedSelller;
  },

  confirmSellerPayment: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(
      req.params.sellerId,
      req.user.id,
    );

    if (!seller) return message.SELLER_NOT_FOUND;

    let dataToUpdate: any = {};

    if (req.body.paymentType === "Fixed") {
      if (
        req.body.isPaymentReceivedOrNot === seller?.fixedPaymentReceivedOrNot
      ) {
        return "Fixed payment already settled!";
      }
      dataToUpdate.fixedPaymentReceivedOrNot = req.body.isPaymentReceivedOrNot;

      const amount = seller?.fixedPaymentAmount || 0;

      const delta = req.body.isPaymentReceivedOrNot ? amount : -amount;

      const updatedUserInfo = await userRepository.updateUser(
        {
          totalFixedPayment: Number(req.user.totalFixedPayment) + delta,
          finalPayout: Number(req.user.finalPayout) + delta,
        },
        req.user?.id,
      );
      if (!updatedUserInfo) return message.FAILED;
    }

    if (req.body.paymentType === "NMV") {
      if (req.body.isPaymentReceivedOrNot === seller?.NMVPaymentReceivedOrNot) {
        return "NMV payment already settled!";
      }
      dataToUpdate.NMVPaymentReceivedOrNot = req.body.isPaymentReceivedOrNot;

      const amount = seller?.NMVPaymentAmount || 0;

      const delta = req.body.isPaymentReceivedOrNot ? amount : -amount;

      const updatedUserInfo = await userRepository.updateUser(
        {
          totalNMVPayment: Number(req.user.totalNMVPayment) + delta,
          finalPayout: Number(req.user.finalPayout) + delta,
        },
        req.user?.id,
      );
      if (!updatedUserInfo) return message.FAILED;
    }

    const updatedSelller = await partnerRepository.updateSellerAddedByPartner(
      dataToUpdate,
      req.params.sellerId,
    );

    if (!updatedSelller) return message.FAILED;

    return updatedSelller;
  },

  deleteSellerAddedByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(
      req.params.sellerId,
      req.user.id,
    );

    if (!seller) return message.SELLER_NOT_FOUND;

    const deletedSelller = await partnerRepository.deleteSellerAddedByPartner(
      req.params.sellerId,
    );

    if (!deletedSelller) return message.FAILED;

    return deletedSelller;
  },

  fetchTopPerformerSellers: async (req: any) => {
    let fetchedSellers =
      await partnerRepository.fetchAllSellersWithOrdersAddedByPartner(req);

    fetchedSellers = fetchedSellers
      .map((seller: any) => {
        const plainSeller = seller.toJSON();
        plainSeller.totalOrder = plainSeller?.sellerOrders?.length;
        let totalGMV: number = 0;
        for (const order of seller?.sellerOrders) {
          totalGMV += Number(order?.orderValue ?? 0);
        }
        plainSeller.GMV = totalGMV;
        return plainSeller;
      })
      .sort((a: any, b: any) => b.GMV - a.GMV)
      .slice(0, req.query?.sellerCount)
      .map((seller: any) => {
        return {
          id: seller?.id,
          sellerId: seller?.sellerId,
          sellerName: seller?.sellerName,
          totalOrder: seller?.totalOrder,
          GMV: seller?.GMV,
        };
      });

    return fetchedSellers;
  },

  fetchShipmentStatusWiseOrders: async (req: any) => {
    let filterQuery: any = {};
    filterQuery = {
      ...req.query,
    };
    let seller;
    if (req.query.sellerId) {
      seller = await partnerRepository.findSellerAddedByPartner(
        req.query.sellerId,
        req.user.id,
      );

      if (!seller) return message.SELLER_NOT_FOUND;
      // req.query.sellerId = seller?.id;
      filterQuery.sellerId = seller?.id;
    }

    const fetchSellers =
      await partnerRepository.fetchAllSellersAddedByPartner(req);

    // req.query.sellerIds = fetchSellers.map((seller: any) => seller?.id);
    filterQuery.sellerIds = fetchSellers.map((seller: any) => seller?.id);

    let fetchedOrders =
      await partnerRepository.fetchAllOrdersByPartner(filterQuery);

    if (!fetchedOrders) {
      return false;
    }

    return fetchedOrders;
  },

  fetchShipmentStatusReport: async (req: any) => {
    let filterQuery: any = {};
    const fetchSellers =
      await partnerRepository.fetchAllSellersAddedByPartner(req);

    filterQuery.sellerIds = fetchSellers.map((seller: any) => seller?.id);
    let fetchedOrders =
      await partnerRepository.fetchAllOrdersByPartner(filterQuery);
    fetchedOrders = fetchedOrders.map((order: any) => order.toJSON());

    let statusWiseData: any = {
      mainData: {
        delivered: {
          label: "DELIVERED",
          today: 0,
          total: 0,
          subData: {
            delivered: {
              label: "DELIVERED",
              today: 0,
              total: 0,
            },
          },
        },
        cancelled: {
          label: "CANCELLED",
          today: 0,
          total: 0,
          subData: {
            cancelled: {
              label: "CANCELLED",
              today: 0,
              total: 0,
            },
            customerCancelled: {
              label: "CUSTOMER CANCELLED",
              today: 0,
              total: 0,
            },
            sellerCancelled: {
              label: "SELLER CANCELLED",
              today: 0,
              total: 0,
            },
          },
        },
        return: {
          label: "RETURN",
          today: 0,
          total: 0,
          subData: {
            returned: {
              label: "RETURNED",
              today: 0,
              total: 0,
            },
            refunded: {
              label: "REFUNDED",
              today: 0,
              total: 0,
            },
            rtoInitiated: {
              label: "RTO INITIATED",
              today: 0,
              total: 0,
            },
            rtoInTransit: {
              label: "RTO IN TRANSIT",
              today: 0,
              total: 0,
            },
            rtoCompleted: {
              label: "RTO COMPLETED",
              today: 0,
              total: 0,
            },
          },
        },
        movement: {
          label: "MOVEMENT",
          today: 0,
          total: 0,
          subData: {
            placed: {
              label: "PLACED",
              today: 0,
              total: 0,
            },
            sellerProcessing: {
              label: "SELLER PROCESSING",
              today: 0,
              total: 0,
            },
            bagPicked: {
              label: "BAG_PICKED",
              today: 0,
              total: 0,
            },
            bagPacked: {
              label: "BAG_PACKED",
              today: 0,
              total: 0,
            },
            dpAssigned: {
              label: "DP_ASSIGNED",
              today: 0,
              total: 0,
            },
            outForPickup: {
              label: "OUT_FOR_PICKUP",
              today: 0,
              total: 0,
            },
            inTransit: {
              label: "IN TRANSIT",
              today: 0,
              total: 0,
            },
            outForDelivery: {
              label: "OUT FOR DELIVERY",
              today: 0,
              total: 0,
            },
            deliveryAttempted: {
              label: "DELIVERY ATTEMPTED",
              today: 0,
              total: 0,
            },
            eddUpdated: {
              label: "EDD_UPDATED",
              today: 0,
              total: 0,
            },
            bagPickFailed: {
              label: "BAG_PICK_FAILED",
              today: 0,
              total: 0,
            },
            rejectedByCustomer: {
              label: "REJECTED_BY_CUSTOMER",
              today: 0,
              total: 0,
            },
            bagLost: {
              label: "BAG_LOST",
              today: 0,
              total: 0,
            },
          },
        },
      },
    };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    for (const order of fetchedOrders) {
      if (order?.shipmentStatus === "DELIVERED") {
        statusWiseData.mainData.delivered.total += 1;
        statusWiseData.mainData.delivered.subData.delivered.total += 1;

        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.delivered.today += 1;
          statusWiseData.mainData.delivered.subData.delivered.today += 1;
        }
      }
      if (order?.shipmentStatus === "CUSTOMER CANCELLED") {
        statusWiseData.mainData.cancelled.total += 1;
        statusWiseData.mainData.cancelled.subData.customerCancelled.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.cancelled.today += 1;
          statusWiseData.mainData.cancelled.subData.customerCancelled.today += 1;
        }
      }
      if (order?.shipmentStatus === "CANCELLED") {
        statusWiseData.mainData.cancelled.total += 1;
        statusWiseData.mainData.cancelled.subData.cancelled.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.cancelled.today += 1;
          statusWiseData.mainData.cancelled.subData.cancelled.today += 1;
        }
      }
      if (order?.shipmentStatus === "SELLER CANCELLED") {
        statusWiseData.mainData.cancelled.total += 1;
        statusWiseData.mainData.cancelled.subData.sellerCancelled.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.cancelled.today += 1;
          statusWiseData.mainData.cancelled.subData.sellerCancelled.today += 1;
        }
      }
      if (order?.shipmentStatus === "RETURNED") {
        statusWiseData.mainData.return.total += 1;
        statusWiseData.mainData.return.subData.returned.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.return.today += 1;
          statusWiseData.mainData.return.subData.returned.today += 1;
        }
      }
      if (order?.shipmentStatus === "REFUNDED") {
        statusWiseData.mainData.return.total += 1;
        statusWiseData.mainData.return.subData.refunded.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.return.today += 1;
          statusWiseData.mainData.return.subData.refunded.today += 1;
        }
      }
      if (order?.shipmentStatus === "RTO INITIATED") {
        statusWiseData.mainData.return.total += 1;
        statusWiseData.mainData.return.subData.rtoInitiated.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.return.today += 1;
          statusWiseData.mainData.return.subData.rtoInitiated.today += 1;
        }
      }
      if (order?.shipmentStatus === "RTO IN TRANSIT") {
        statusWiseData.mainData.return.total += 1;
        statusWiseData.mainData.return.subData.rtoInTransit.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.return.today += 1;
          statusWiseData.mainData.return.subData.rtoInTransit.today += 1;
        }
      }
      if (order?.shipmentStatus === "RTO COMPLETED") {
        statusWiseData.mainData.return.total += 1;
        statusWiseData.mainData.return.subData.rtoCompleted.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.return.today += 1;
          statusWiseData.mainData.return.subData.rtoCompleted.today += 1;
        }
      }
      if (order?.shipmentStatus === "PLACED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.placed.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.placed.today += 1;
        }
      }
      if (order?.shipmentStatus === "SELLER PROCESSING") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.sellerProcessing.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.sellerProcessing.today += 1;
        }
      }
      if (order?.shipmentStatus === "BAG_PICKED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.bagPicked.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.bagPicked.today += 1;
        }
      }
      if (order?.shipmentStatus === "BAG_PACKED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.bagPacked.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.bagPacked.today += 1;
        }
      }
      if (order?.shipmentStatus === "DP_ASSIGNED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.dpAssigned.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.dpAssigned.today += 1;
        }
      }
      if (order?.shipmentStatus === "OUT_FOR_PICKUP") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.outForPickup.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.outForPickup.today += 1;
        }
      }
      if (order?.shipmentStatus === "IN TRANSIT") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.inTransit.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.inTransit.today += 1;
        }
      }
      if (order?.shipmentStatus === "OUT FOR DELIVERY") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.outForDelivery.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.outForDelivery.today += 1;
        }
      }
      if (order?.shipmentStatus === "DELIVERY ATTEMPTED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.deliveryAttempted.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.deliveryAttempted.today += 1;
        }
      }
      if (order?.shipmentStatus === "EDD_UPDATED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.eddUpdated.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.eddUpdated.today += 1;
        }
      }
      if (order?.shipmentStatus === "BAG_PICK_FAILED") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.bagPickFailed.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.bagPickFailed.today += 1;
        }
      }
      if (order?.shipmentStatus === "REJECTED_BY_CUSTOMER") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.rejectedByCustomer.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.rejectedByCustomer.today += 1;
        }
      }
      if (order?.shipmentStatus === "BAG_LOST") {
        statusWiseData.mainData.movement.total += 1;
        statusWiseData.mainData.movement.subData.bagLost.total += 1;
        // check if updated today
        const updatedAt = new Date(order.updatedAt);

        if (updatedAt >= todayStart && updatedAt <= todayEnd) {
          statusWiseData.mainData.movement.today += 1;
          statusWiseData.mainData.movement.subData.bagLost.today += 1;
        }
      }
    }
    if (!statusWiseData) {
      return false;
    }
    return statusWiseData;
  },

  fetchSellersOrderGrowthByPartner: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(
      req.params.sellerId,
      req.user.id,
    );

    if (!seller) return message.SELLER_NOT_FOUND;

    // req.params.sellerId = seller?.sellerId;

    const orderGrowth =
      await partnerRepository.fetchSellersOrderGrowthByPartner(req);

    if (!orderGrowth) {
      return false;
    }
    return orderGrowth;
  },

  fetchCancelledOrHighReturnsSellersByPartner: async (req: any) => {
    let allSellersOfPartner =
      await partnerRepository.fetchCancelledOrHighReturnsSellersByPartner(req);

    allSellersOfPartner = allSellersOfPartner.map((item: any) =>
      item.get({ plain: true }),
    );

    let filteredByQuery;

    if (JSON.parse(req.query.cancelledBySellers)) {
      filteredByQuery = allSellersOfPartner;
    }
    if (JSON.parse(req.query.highReturnsSellers)) {
      filteredByQuery = allSellersOfPartner.filter((seller: any) => {
        const returnOrdersOfSeller = seller?.sellerOrders.filter((order: any) =>
          [
            "RETURNED",
            "REFUNDED",
            "RTO INITIATED",
            "RTO IN TRANSIT",
            "RTO COMPLETED",
          ].includes(order?.shipmentStatus),
        );

        const percentageOfReturnOrder =
          ((returnOrdersOfSeller.length ?? 0) /
            (seller?.sellerOrders.length ?? 0)) *
          100;

        if (percentageOfReturnOrder >= 20) {
          return seller;
        }
      });
    }

    if (!filteredByQuery) return false;

    filteredByQuery = filteredByQuery.map((seller: any) => {
      seller.password = helper.encrypt(seller.password);
      delete seller.sellerOrders;

      return seller;
    });

    return filteredByQuery;
  },

  fetchSalesReport: async (req: any) => {
    const salesReport = await partnerRepository.fetchSalesReport(req);

    if (!salesReport) {
      return false;
    }
    return salesReport;
  },

  fetchAllSellersAddedByPartner: async (req: any) => {
    let sellersData =
      await partnerRepository.fetchAllSellersAddedByPartner(req);

    for (const seller of sellersData) {
      seller.password = helper.encrypt(seller.password);
      const filterQuery: any = {};
      filterQuery.sellerId = seller?.id;
      const fetchedOrders =
        await partnerRepository.fetchAllOrdersByPartner(filterQuery);

      let totalGMV = 0;

      const data = fetchedOrders.reduce((acc: any, curr: any) => {
        totalGMV = totalGMV + curr?.orderValue;
        if (!acc[curr?.shipmentStatus]) {
          acc[curr?.shipmentStatus] = 1;
        } else {
          acc[curr?.shipmentStatus] += 1;
        }

        if (!acc[curr?.modeOfPayment]) {
          acc[curr?.modeOfPayment] = 1;
        } else {
          acc[curr?.modeOfPayment] += 1;
        }

        return acc;
      }, {});

      const totalReturnedTypeOrders =
        (data?.["RETURNED"] ?? 0) +
        (data?.["REFUNDED"] ?? 0) +
        (data?.["RTO INITIATED"] ?? 0) +
        (data?.["RTO IN TRANSIT"] ?? 0) +
        (data?.["RTO COMPLETED"] ?? 0);

      seller.totalOrders = fetchedOrders.length;
      seller.totalReturnedTypeOrders = totalReturnedTypeOrders;
      seller.deliveredOrders = data?.["DELIVERED"] ?? 0;
      seller.customerCancelledOrders = data?.["CUSTOMER CANCELLED"] ?? 0;
      seller.cancelledOrders = data?.["CANCELLED"] ?? 0;
      seller.sellerCancelledOrders = data?.["SELLER CANCELLED"] ?? 0;
      seller.returnedOrders = data?.["RETURNED"] ?? 0;
      seller.refundedOrders = data?.["REFUNDED"] ?? 0;
      seller.rtoInitiatedOrders = data?.["RTO INITIATED"] ?? 0;
      seller.rtoInTransitOrders = data?.["RTO IN TRANSIT"] ?? 0;
      seller.rtoCompletedOrders = data?.["RTO COMPLETED"] ?? 0;
      seller.placedOrders = data?.["PLACED"] ?? 0;
      seller.sellerProcessingOrders = data?.["SELLER PROCESSING"] ?? 0;
      seller.bagPickedOrders = data?.["BAG_PICKED"] ?? 0;
      seller.bagPackedOrders = data?.["BAG_PACKED"] ?? 0;
      seller.dpAssignedOrders = data?.["DP_ASSIGNED"] ?? 0;
      seller.outForPickupOrders = data?.["OUT_FOR_PICKUP"] ?? 0;
      seller.inTransitOrders = data?.["IN TRANSIT"] ?? 0;
      seller.outForDeliveryOrders = data?.["OUT FOR DELIVERY"] ?? 0;
      seller.deliveryAttemptedOrders = data?.["DELIVERY ATTEMPTED"] ?? 0;
      seller.eddUpdatedOrders = data?.["EDD_UPDATED"] ?? 0;
      seller.bagPickFailedOrders = data?.["BAG_PICK_FAILED"] ?? 0;
      seller.rejectedByCustomerOrders = data?.["REJECTED_BY_CUSTOMER"] ?? 0;
      seller.bagLostOrders = data?.["BAG_LOST"] ?? 0;
      seller.totalGMV = totalGMV;
      seller.returnedOrderPercentage =
        (totalReturnedTypeOrders / fetchedOrders.length) * 100;
      seller.cancelledOrderPercentage =
        ((data?.["CANCELLED"] ?? 0) / fetchedOrders.length) * 100;
      seller.CODOrdersPercentage =
        ((data?.["COD"] ?? 0) / fetchedOrders.length) * 100;
      seller.prepaidOrdersPercentage =
        ((data?.["PREPAID"] ?? 0) / fetchedOrders.length) * 100;
      seller.totalPayout =
        (seller?.fixedPaymentAmount ?? 0) + (seller?.NMVPaymentAmount ?? 0);
    }

    return sellersData;
  },

  fetchAllOrdersByPartner: async (req: any) => {
    const filterQuery: any = {};
    filterQuery.sellerId = req.query.sellerId;
    if (filterQuery.sellerId) {
      const seller = await partnerRepository.findSellerAddedByPartner(
        filterQuery.sellerId,
        req.user?.id,
      );
      filterQuery.sellerId = seller?.sellerId;
    }

    const ordersData =
      await partnerRepository.fetchAllOrdersByPartner(filterQuery);

    if (!ordersData) return message.FAILED;

    return ordersData;
  },

  fetchPartnerFileUploadPlaceholders: async (req: any) => {
    let filterQuery: any = {};
    filterQuery = {
      ...req.query,
      user: req.user,
    };
    const fetchedPlaceholdersData =
      await partnerRepository.fetchPartnerFileUploadPlaceholders(filterQuery);

    const newData = fetchedPlaceholdersData.reduce((acc: any, curr: any) => {
      if (!acc[curr?.expectedDate]) {
        acc[curr?.expectedDate] = [curr];
      } else {
        acc[curr?.expectedDate].push(curr);
      }
      return acc;
    }, {});

    if (!newData) return message.FAILED;

    return newData;
  },

  addSellersByPartnerUsingFile: async (req: any) => {
    if (!req.file) {
      return "Please provide a excel or csv file to upload data!";
    }

    const filePath = req.file.path;

    let eventsData: any[] = [];

    let workBook: xlsx.WorkBook;

    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      workBook = xlsx.readFile(filePath);
    } else if (req.file.mimetype === "text/csv") {
      const csvBuffer = fs.readFileSync(filePath, { encoding: "utf8" });
      workBook = xlsx.read(csvBuffer, { type: "string" });
    } else {
      return "Unsupported file format. Please upload an XLSX or CSV file.";
    }

    const sheetName = workBook.SheetNames[0];

    const sheet = workBook.Sheets[sheetName];

    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) {
      return "No data found in the uploaded file!";
    }

    const ifEmptySpaceAvailableInData = data.find((item: any) =>
      Object.keys(item).some((key: string) => key.includes("__EMPTY_")),
    );

    if (!ifEmptySpaceAvailableInData) {
      eventsData = data;
    } else {
      eventsData = data
        .map((item: any) => {
          const emptyKeyNames = Object.keys(item);
          return {
            sellerId: item[emptyKeyNames[0]],
            sellerName: item[emptyKeyNames[1]],
            brandName: item[emptyKeyNames[2]],
            launchingDate: item[emptyKeyNames[3]],
            listingDate: item[emptyKeyNames[4]],
            sellerEmailId: item[emptyKeyNames[5]],
            phoneNumber: item[emptyKeyNames[6]],
            password: item[emptyKeyNames[7]],
            brandApproval: item[emptyKeyNames[8]],
            gstNumber: item[emptyKeyNames[9]],
            trademarkClass: item[emptyKeyNames[10]],
            productCategories: item[emptyKeyNames[11]],
          };
        })
        .filter((_, index) => index > 0);
    }

    eventsData = eventsData.map((event: any) => {
      if (event.launchingDate) {
        // If Excel date is stored as a number (Excel serial date)
        if (typeof event.launchingDate === "number") {
          // Convert Excel serial date to JavaScript Date
          // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
          event.launchingDate = new Date(
            (event.launchingDate - 25569) * 86400 * 1000,
          );
        }
        // If date is already in string format like '2023-05-15T14:30:00'
        else if (typeof event.launchingDate === "string") {
          event.launchingDate = new Date(event.launchingDate);
        }
      }
      if (event.listingDate) {
        // If Excel date is stored as a number (Excel serial date)
        if (typeof event.listingDate === "number") {
          // Convert Excel serial date to JavaScript Date
          // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
          event.listingDate = new Date(
            (event.listingDate - 25569) * 86400 * 1000,
          );
        }
        // If date is already in string format like '2023-05-15T14:30:00'
        else if (typeof event.listingDate === "string") {
          event.listingDate = new Date(event.listingDate);
        }
      }
      if (event.phoneNumber) {
        event.phoneNumber = event.phoneNumber.toString();
      }
      if (event.productCategories) {
        event.productCategories = event.productCategories
          .split(",")
          .map((item: any) => item.trim());
      }
      return {
        ...event,
        partnerId: req.user.id,
      };
    });

    const errorDatas: any = [];

    eventsData.map((event: any) => {
      if (event.phoneNumber) {
        if (!/^\d{10}$/.test(event?.phoneNumber)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Phone number is Invalid(not 10 digit number)!",
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(event?.sellerEmailId)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid Email!",
          });
        }

        const gstRegex =
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (!gstRegex.test(event?.gstNumber)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid GST Number!",
          });
        }

        const validBrandApprovalStatuses = ["pending", "approved"];

        if (!validBrandApprovalStatuses.includes(event.brandApproval)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid Brand Approval status!",
          });
        }

        const validTrademarkClassStatuses = ["pending", "approved"];

        if (!validTrademarkClassStatuses.includes(event.trademarkClass)) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid trademark class status!",
          });
        }

        const validProductCategories = [
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
        ];

        const notValidProductCategories = event.productCategories.some(
          (pc: any) => !validProductCategories.includes(pc),
        );

        if (notValidProductCategories) {
          errorDatas.push({
            sellerId: event.sellerId,
            errorMessage: "Invalid product categories!",
          });
        }
      }
    });

    const sellerIdsToExtract: any = [];

    if (errorDatas.length) {
      // return "Invalid data found in the uploaded file!"
      errorDatas.map((errorData: any) => {
        sellerIdsToExtract.push(errorData.sellerId);
      });
    }

    if (sellerIdsToExtract.length) {
      eventsData = eventsData.filter(
        (event) => !sellerIdsToExtract.includes(event?.sellerId),
      );
    }

    eventsData = eventsData.filter((event) => event.sellerId !== "DEMO12");

    let sellersData =
      await partnerRepository.createOrUpdateBulkSellers(eventsData);

    if (!sellersData) return message.FAILED;

    return {
      errorDatas,
      sellerAddedWithValidData: sellersData.map((seller: any) =>
        seller.get({ plain: true }),
      ).length,
    };
  },

  uploadTimelineDataManagementFile: async (req: any) => {
    if (!req.file) {
      return "Please provide a excel or csv file to upload data!";
    }

    const validTimlineKeys = ["daily", "monthly", "weekly"];

    if (!validTimlineKeys.includes(req.body?.timelineDataTenure)) {
      return "timeline-data-tenure must be one of: daily, monthly or weekly";
    }

    if (req.body.timelineDataTenure === "daily" && !req.body.uploadDate) {
      return "Upload date is required field!";
    }

    if (
      ["weekly", "monthly"].includes(req.body.timelineDataTenure) &&
      !req.body.dateRangeFromWeeklyOrMonthly
    ) {
      return "Weekly from date is required field!";
    }

    if (
      ["weekly", "monthly"].includes(req.body.timelineDataTenure) &&
      !req.body.dateRangeToWeeklyOrMonthly
    ) {
      return "Weekly to date is required field!";
    }

    const filePath = req.file.path;
    let result: boolean | string = false;

    let eventsData: any[] = [];

    let workBook: xlsx.WorkBook;

    if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      workBook = xlsx.readFile(filePath);
    } else if (req.file.mimetype === "text/csv") {
      const csvBuffer = fs.readFileSync(filePath, { encoding: "utf8" });
      workBook = xlsx.read(csvBuffer, { type: "string" });
    } else {
      return "Unsupported file format. Please upload an XLSX or CSV file.";
    }

    const sheetName = workBook.SheetNames[0];

    const sheet = workBook.Sheets[sheetName];

    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (!data.length) {
      return "No data found in the uploaded file!";
    }

    const ifEmptySpaceAvailableInData = data.find((item: any) =>
      Object.keys(item).some((key: string) => key.includes("__EMPTY_")),
    );

    let filterQuery: any = {};

    filterQuery = {
      fromDate:
        req.body?.timelineDataTenure === "daily"
          ? req.body.uploadDate
          : req.body.dateRangeFromWeeklyOrMonthly,
      toDate:
        req.body?.timelineDataTenure === "daily"
          ? req.body.uploadDate
          : req.body.dateRangeToWeeklyOrMonthly,
      user: req.user,
      status: "uploaded",
      fileType: req.body?.timelineDataTenure,
    };

    const fetchPlaceholder =
      await partnerRepository.fetchPartnerFileUploadPlaceholders(filterQuery);

    if (req.body?.timelineDataTenure === "daily") {
      if (fetchPlaceholder?.[0]) {
        return `${req.body?.timelineDataTenure} file is already uploaded for this date :- ${req.body.uploadDate}.`;
      }
      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data
          .map((item: any) => {
            const emptyKeyNames = Object.keys(item);
            return {
              "Seller ID": item[emptyKeyNames[0]],
              "Seller Name": item[emptyKeyNames[1]],
              "Seller Status": item[emptyKeyNames[2]],
              "Seller Email ID": item[emptyKeyNames[3]],
              "Partner Name": item[emptyKeyNames[4]],
              "Partner Email ID": item[emptyKeyNames[5]],
              "Launch Date": item[emptyKeyNames[6]],
              "Launch Month": item[emptyKeyNames[6]],
              "Order Created Date": item[emptyKeyNames[7]],
              "Order ID": item[emptyKeyNames[8]],
              "Shipment ID": item[emptyKeyNames[9]],
              "Delivery AWB No": item[emptyKeyNames[10]],
              "Shipment Status": item[emptyKeyNames[11]],
              "Order Type": item[emptyKeyNames[12]],
              "Order Value": item[emptyKeyNames[13]],
              "Delivery Partner": item[emptyKeyNames[14]],
              "Mode Of Payment": item[emptyKeyNames[15]],
              "First Seller Order": item[emptyKeyNames[16]],
              "Order Schedule for Pickup": item[emptyKeyNames[17]],
              "Order Shipped": item[emptyKeyNames[18]],
              "Order Cancelled By Seller": item[emptyKeyNames[19]],
              "Order Auto Cancelled": item[emptyKeyNames[20]],
              "Order Cancelled By Customer": item[emptyKeyNames[21]],
              "Reverse Shipment ID": item[emptyKeyNames[22]],
              "RTO AWB No": item[emptyKeyNames[23]],
              "Reverse Shipment Status": item[emptyKeyNames[24]],
            };
          })
          .filter((_, index) => index > 0);
      }

      eventsData = eventsData.map((event) =>
        helper.trimKeysAndValuesOfObject(event),
      );

      if (
        !eventsData.find((event: any) =>
          Object.keys(event).includes("Shipment ID"),
        )
      ) {
        return "Invalid file uploaded, you are requested to upload daily file here!";
      }

      const sellerIdsfromFile: any = [];

      eventsData.map((event: any) => {
        sellerIdsfromFile.push(event?.["Seller ID"]);
      });

      const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)];

      const findAllSellers = (
        await partnerRepository.fetchAllSellersBySellerIds(
          uniqueSellerIdsfromFile,
        )
      ).map((seller: any) => seller?.sellerId);

      const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter(
        (seller: any) => !findAllSellers.includes(seller),
      );

      if (sellerIDsNotInDB.length) {
        return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      }

      eventsData = eventsData.map((event: any) => {
        const orderCreatedDate = "Order Created Date";
        // const launchingDate = "Launch Date";
        const launchingDate = "Launch Month";

        if (event && event?.[orderCreatedDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[orderCreatedDate] === "number") {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[orderCreatedDate] = new Date(
              (event?.[orderCreatedDate] - 25569) * 86400 * 1000,
            );
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[orderCreatedDate] === "string") {
            event[orderCreatedDate] = new Date(event?.[orderCreatedDate]);
          }
        }
        if (event && event?.[launchingDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[launchingDate] === "number") {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[launchingDate] = new Date(
              (event?.[launchingDate] - 25569) * 86400 * 1000,
            );
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[launchingDate] === "string") {
            event[launchingDate] = new Date(event?.[launchingDate]);
          }
        }
        return event;
      });
      console.log("🚀 ~ eventsData:", eventsData);

      // const sellerDataSingular: any = {};

      // for (const event of eventsData) {
      //   if (!event?.["Seller ID"]) continue;

      //   if (!sellerDataSingular[event?.["Seller ID"]]) {
      //     sellerDataSingular[event?.["Seller ID"]] = {};
      //   }

      //   sellerDataSingular[event?.["Seller ID"]] = {
      //     sellerId: event?.["Seller ID"],
      //     sellerName: event?.["Seller Name                               "],
      //     sellerStatus: (event?.["Seller Status"])?.toLowerCase(),
      //     sellerEmailId: event?.["Seller Email ID"],
      //   };
      // }

      // for (const data of Object.entries(sellerDataSingular)) {
      //   const updateSeller = await partnerRepository.updateSellerAddedByPartner(data?.[1], data?.[0]);
      // }

      const uniqueMap = new Map<string, any>();

      for (const seller of eventsData) {
        uniqueMap.set(seller?.["Seller ID"], {
          sellerId: seller?.["Seller ID"],
          sellerName: seller?.["Seller Name"],
          sellerStatus: seller?.["Seller Status"]?.toLowerCase(),
          sellerEmailId: seller?.["Seller Email ID"],
          launchingDate: seller?.["Launch Month"],
          // partnerId: req.user?.id,
        });
      }

      const finalData = Array.from(uniqueMap.values());

      // let sellersData =
      //   await partnerRepository.createOrUpdateBulkSellers(finalData);

      for (const seller of finalData) {
        let sellersData =
          await partnerRepository.updateSellerByReaiSellerIdAddedByPartner(
            seller,
            seller?.sellerId,
          );

        if (!sellersData) {
          return message.FAILED;
        }
      }

      let senitizedOrdersData = await Promise.all(
        eventsData.map(async (event: any) => {
          const findSeller =
            await partnerRepository.findSellerByRealSellerIdAddedByPartner(
              event?.["Seller ID"],
              req.user?.id,
            );

          return {
            sellerrId: findSeller?.id,
            orderCreatedDate: event?.["Order Created Date"],
            orderId: event?.["Order ID"],
            shipmentId: event?.["Shipment ID"],
            shipmentStatus: event?.["Shipment Status"],
            orderValue: event?.["Order Value"],
            deliveryPartner: event?.["Delivery Partner"] ?? "",
            modeOfPayment: event?.["Mode Of Payment"],
            orderShipped: event?.["Order Shipped"],
          };
        }),
      );

      // const orderIdCountMap = new Map<string, number>();

      // for (const row of senitizedOrdersData) {
      //   if (!row.orderId) continue;

      //   orderIdCountMap.set(
      //     row.orderId,
      //     (orderIdCountMap.get(row.orderId) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));

      // ------   shipment duplicate -----

      // const shipmentIdCountMap = new Map<string, number>();

      // for (const row of senitizedOrdersData) {
      //   const findField = "orderId"; // shipmentId
      //   if (!row?.[findField]) continue;

      //   shipmentIdCountMap.set(
      //     row?.[findField],
      //     (shipmentIdCountMap.get(row?.[findField]) || 0) + 1,
      //   );
      // }

      // const duplicateshipmentIds = Array.from(shipmentIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([findField, count]) => ({ findField, count }));

      // function dedupeJioMartRows(rows) {
      const uniqueOrdersMap = new Map();

      for (const row of senitizedOrdersData) {
        const key = `${row.sellerrId}|${row.orderId}|${row.shipmentId}`;
        console.log("🚀 ~ key:", key);

        // last occurrence wins (latest status)

        if (uniqueOrdersMap.has(key)) {
          console.log("key ekdo: ", key, "row ekdo: ", row);
        }
        uniqueOrdersMap.set(key, row);
      }

      const finalUniqueOrders = Array.from(uniqueOrdersMap.values());
      console.log("🚀 ~ finalUniqueOrders:", finalUniqueOrders.length);
      // }

      // -------- shipment end -----

      // const uniqueMap = new Map();

      // for (const row of senitizedOrdersData) {
      //   const key = `${row.sellerId}_${row.orderCreatedDate}`;
      //   uniqueMap.set(key, row); // last one wins
      // }

      // const dedupedData = Array.from(uniqueMap.values());

      const addedOrders =
        await partnerRepository.sellerOrdersAddedByPartnerUsingFile(
          finalUniqueOrders,
        );

      if (!addedOrders) {
        return message.FAILED;
      }

      const updatePlaceholder =
        await partnerRepository.updatePartnerFileUploadPlaceholder(req);

      if (!updatePlaceholder) {
        return message.FAILED;
      }
      result = true;
    }

    if (req.body?.timelineDataTenure === "weekly") {
      if (fetchPlaceholder?.[0]) {
        return `${req.body?.timelineDataTenure} file is already uploaded within this date range :- ${req.body.dateRangeFromWeeklyOrMonthly} and ${req.body.dateRangeToWeeklyOrMonthly}.`;
      }
      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data
          .map((item: any) => {
            const emptyKeyNames = Object.keys(item);
            return {
              "Seller ID": item[emptyKeyNames[0]],
              "Seller Name": item[emptyKeyNames[1]],
              "Account Email Id": item[emptyKeyNames[2]],
              "Seller State": item[emptyKeyNames[3]],
              "Partner Name": item[emptyKeyNames[4]],
              "Partner Email Id": item[emptyKeyNames[5]],
              "Regsitered Date": item[emptyKeyNames[6]],
              "Launch Date": item[emptyKeyNames[7]],
              "Dominant L1 At Launch": item[emptyKeyNames[8]],
              "First Order Seller Cancelled ": item[emptyKeyNames[9]],
              "First 10 Order Cancellation Seller": item[emptyKeyNames[10]],
              "SKU At Launch": item[emptyKeyNames[11]],
              "Current SKU Live": item[emptyKeyNames[12]],
              "Seller Cancelled Order": item[emptyKeyNames[13]],
              "Auto Cancelled Orders": item[emptyKeyNames[14]],
              "Total Cancelled Orders": item[emptyKeyNames[15]],
              "Total Orders": item[emptyKeyNames[16]],
              "First 10 Order Cancellation Seller Count":
                item[emptyKeyNames[17]],
            };
          })
          .filter((_, index) => index > 0);
      }

      eventsData = eventsData.map((event) =>
        helper.trimKeysAndValuesOfObject(event),
      );

      if (
        !eventsData.find((event: any) =>
          Object.keys(event).includes("Dominant L1 At Launch"),
        )
      ) {
        return "Invalid file uploaded, you are requested to upload weekly file here!";
      }

      const sellerIdsfromFile: any = [];

      eventsData.map((event: any) => {
        sellerIdsfromFile.push(event?.["Seller ID"]);
      });

      const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)];

      // uniqueSellerIdsfromFile.push("D77EE7");

      const findAllSellers = (
        await partnerRepository.fetchAllSellersBySellerIds(
          uniqueSellerIdsfromFile,
        )
      ).map((seller: any) => seller?.sellerId);

      const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter(
        (seller: any) => !findAllSellers.includes(seller),
      );

      if (sellerIDsNotInDB.length) {
        return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      }

      eventsData = eventsData.map((event: any) => {
        const launchingDate = "Launch Date";

        if (event && event?.[launchingDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[launchingDate] === "number") {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[launchingDate] = new Date(
              (event?.[launchingDate] - 25569) * 86400 * 1000,
            );
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[launchingDate] === "string") {
            event[launchingDate] = new Date(event?.[launchingDate]);
          }
        }
        return event;
      });

      // const orderIdCountMap = new Map<string, number>();

      // for (const row of eventsData) {
      //   if (!row?.["Seller ID"]) continue;

      //   orderIdCountMap.set(
      //     row?.["Seller ID"],
      //     (orderIdCountMap.get(row?.["Seller ID"]) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));

      const sanitizedSellers = eventsData.map((row: any) => ({
        sellerId: row["Seller ID"],
        sellerName: row["Seller Name"],
        sellerEmailId: row["Account Email Id"]?.trim(),
        sellerStatus: row["Seller State"]?.toLowerCase(),
        launchingDate: row["Launch Date"],
        dominantL1AtLaunch: row["Dominant L1 At Launch"]?.trim() ?? "",
        SKUsAtLaunch: row["SKU At Launch"] ?? 0,
        currentSKUsLive: row["Current SKU Live"] ?? 0,
        // partnerId: req.user?.id,
      }));

      const uniqueMap = new Map<string, any>();

      for (const seller of sanitizedSellers) {
        uniqueMap.set(seller?.sellerId, seller);
      }

      const finalData = Array.from(uniqueMap.values());

      // let sellersData =
      //   await partnerRepository.createOrUpdateBulkSellers(finalData);

      for (const seller of sanitizedSellers) {
        let sellersData =
          await partnerRepository.updateSellerByReaiSellerIdAddedByPartner(
            seller,
            seller?.sellerId,
          );

        if (!sellersData) {
          return message.FAILED;
        }
      }

      const updatePlaceholder =
        await partnerRepository.updatePartnerFileUploadPlaceholder(req);

      if (!updatePlaceholder) {
        return message.FAILED;
      }

      result = true;
    }

    if (req.body?.timelineDataTenure === "monthly") {
      if (fetchPlaceholder?.[0]) {
        return `${req.body?.timelineDataTenure} file is already uploaded within this date range :- ${req.body.dateRangeFromWeeklyOrMonthly} and ${req.body.dateRangeToWeeklyOrMonthly}.`;
      }
      if (!ifEmptySpaceAvailableInData) {
        eventsData = data;
      } else {
        eventsData = data
          .map((item: any) => {
            const emptyKeyNames = Object.keys(item);
            return {
              "Seller ID": item[emptyKeyNames[0]],
              "Seller Name": item[emptyKeyNames[1]],
              "Launch Date": item[emptyKeyNames[7]],
              "Account Email Id": item[emptyKeyNames[2]],
              "Partner Name": item[emptyKeyNames[4]],
              "Partner Email Id": item[emptyKeyNames[5]],
              "Payout-Type": item[emptyKeyNames[5]],
              "Current SKU Live": item[emptyKeyNames[12]],
              "First Order Seller Cancelled Penalty": item[emptyKeyNames[5]],
              "Eligible for Payout": item[emptyKeyNames[5]],
              "NMV Slab/ Fixed Slab": item[emptyKeyNames[5]],
              "Total Payout": item[emptyKeyNames[5]],
            };
          })
          .filter((_, index) => index > 0);
      }

      // const sellerIdsfromFile: any = [];

      // eventsData.map((event: any) => {
      //   sellerIdsfromFile.push(event?.["Seller ID"])
      // });

      // const uniqueSellerIdsfromFile: any = [...new Set(sellerIdsfromFile)]

      // uniqueSellerIdsfromFile.push("D77EE7");

      // const findAllSellers = (await partnerRepository.fetchAllSellersBySellerIds(uniqueSellerIdsfromFile)).map((seller: any) => seller?.sellerId);

      // const sellerIDsNotInDB = uniqueSellerIdsfromFile.filter((seller: any) => !findAllSellers.includes(seller))

      // if (sellerIDsNotInDB.length) {
      //   return `You haven't added these sellers: ${sellerIDsNotInDB}! So you are requested to add these sellers first then retry to upload file!`;
      // }

      eventsData = eventsData.map((event) =>
        helper.trimKeysAndValuesOfObject(event),
      );

      if (
        !eventsData.find((event: any) =>
          Object.keys(event).includes("Total Payout"),
        )
      ) {
        return "Invalid file uploaded, you are requested to upload monthly file here!";
      }

      function getFirstDateOfMonth(date: Date): Date {
        // return new Date(date.getFullYear(), date.getMonth(), 1);
        return new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            1, // first day
          ),
        );
      }

      function getNMVMonth(date: Date): Date {
        // return new Date(date.getFullYear(), date.getMonth() + 2, 1);
        return new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + 2, // +2 months
            1, // first day
          ),
        );
      }

      eventsData = eventsData.map((event: any) => {
        const launchDate = "Launch Date";

        if (event && event?.[launchDate]) {
          // If Excel date is stored as a number (Excel serial date)
          if (typeof event?.[launchDate] === "number") {
            // Convert Excel serial date to JavaScript Date
            // Excel dates are days since 1900-01-01 (except Excel thinks 1900 is a leap year)
            event[launchDate] = new Date(
              (event?.[launchDate] - 25569) * 86400 * 1000,
            );
          }
          // If date is already in string format like '2023-05-15T14:30:00'
          else if (typeof event?.[launchDate] === "string") {
            event[launchDate] = new Date(event?.[launchDate]);
          }
        }
        return event;
      });

      // const orderIdCountMap = new Map<string, number>();

      // for (const row of eventsData) {
      //   if (!row?.["Seller ID"]) continue;

      //   orderIdCountMap.set(
      //     row?.["Seller ID"],
      //     (orderIdCountMap.get(row?.["Seller ID"]) || 0) + 1
      //   );
      // }

      // const duplicateOrderIds = Array.from(orderIdCountMap.entries())
      //   .filter(([_, count]) => count > 1)
      //   .map(([orderId, count]) => ({ orderId, count }));

      const sanitizedSellers = eventsData.map((row: any) => ({
        sellerId: row?.["Seller ID"],
        sellerName: row?.["Seller Name"],
        sellerEmailId: row?.["Account Email Id"]?.trim(),
        launchingDate: row?.["Launch Date"],
        ...(!isNaN(row?.["Current SKU Live"]) && {
          currentSKUsLive: row?.["Current SKU Live"] ?? 0,
        }),
        ...(row?.["Payout-Type"].includes("NMV")
          ? {
              NMVPaymentAmount: row?.["Total Payout"],
              NMVPaymentMonthYear: getNMVMonth(row?.["Launch Date"]),
            }
          : row?.["Payout-Type"].includes("Fixed")
            ? {
                fixedPaymentAmount: row?.["Total Payout"],
                fixedPaymentMonthYear: getFirstDateOfMonth(
                  row?.["Launch Date"],
                ),
              }
            : null),
        // partnerId: req.user?.id,
      }));

      // const uniqueMap = new Map<string, any>();

      // for (const seller of sanitizedSellers) {
      //   uniqueMap.set(seller?.sellerId, seller);
      // }

      // const finalData = Array.from(uniqueMap.values());

      // let sellersData =
      //   await partnerRepository.createOrUpdateBulkSellers(sanitizedSellers);
      for (const seller of sanitizedSellers) {
        let sellersData =
          await partnerRepository.updateSellerByReaiSellerIdAddedByPartner(
            seller,
            seller?.sellerId,
          );

        if (!sellersData) {
          return message.FAILED;
        }
      }

      const updatePlaceholder =
        await partnerRepository.updatePartnerFileUploadPlaceholder(req);

      if (!updatePlaceholder) {
        return message.FAILED;
      }

      result = true;
    }

    helper.deleteLocalFile(filePath);
    return result;
  },
};

export default partnerService;
