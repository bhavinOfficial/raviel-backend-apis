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

  findSellerAddedByPartner: async (sellerId: any, partnerId: any) => {
    return await db.PartnerAddedSellers.findOne({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.eq]: sellerId,
            },
          },
          {
            partnerId: {
              [Op.eq]: partnerId,
            },
          },
        ],
      },
      raw: true,
    });
  },

  findSellerByRealSellerIdAddedByPartner: async (
    sellerId: string,
    partnerId: string,
  ) => {
    return await db.PartnerAddedSellers.findOne({
      where: {
        [Op.and]: [
          {
            sellerId: {
              [Op.eq]: sellerId,
            },
          },
          {
            partnerId: {
              [Op.eq]: partnerId,
            },
          },
        ],
      },
      raw: true,
    });
  },

  updateSellerAddedByPartner: async (data: any, sellerId: string) => {
    const [updatedCount, [updatedSeller]] = await db.PartnerAddedSellers.update(
      data,
      {
        where: {
          id: sellerId,
        },
        raw: true,
        returning: true,
      },
    );

    if (updatedCount) {
      return updatedSeller;
    } else {
      return null;
    }
  },

  updateSellerByReaiSellerIdAddedByPartner: async (
    data: any,
    sellerId: string,
  ) => {
    const [updatedCount, [updatedSeller]] = await db.PartnerAddedSellers.update(
      data,
      {
        where: {
          sellerId: sellerId,
        },
        raw: true,
        returning: true,
      },
    );

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
          id: req.query?.sellerId,
        }),
        ...(req.query?.sellerStatus && {
          sellerStatus: req.query?.sellerStatus,
        }),
        ...(req.query?.sellerName && {
          sellerName: { [Op.iLike]: `%${req.query?.sellerName}%` },
        }),
        ...(req.query.paymentByMonthYear && {
          [Op.or]: [
            {
              fixedPaymentMonthYear: {
                [Op.eq]: req.query.paymentByMonthYear,
              },
            },
            {
              NMVPaymentMonthYear: {
                [Op.eq]: req.query.paymentByMonthYear,
              },
            },
          ],
        }),
      },
      raw: true,
    });
    return fetchedSellers;
  },

  fetchPartnerFileUploadPlaceholders: async (filterQuery: any) => {
    const fetchedPlaceholders =
      await db.PartnerExcelFileUploadPlaceholders.findAll({
        where: {
          partnerId: filterQuery.user?.id,
          expectedDate: {
            [Op.between]: [filterQuery.fromDate, filterQuery.toDate],
          },
          ...(filterQuery.fileType && { fileType: filterQuery.fileType }),
          ...(filterQuery.status && { status: filterQuery.status }),
        },
        order: [["expected_date", "ASC"]],
        raw: true,
      });
    return fetchedPlaceholders;
  },

  updatePartnerFileUploadPlaceholder: async (req: any) => {
    const updatePlaceholders =
      await db.PartnerExcelFileUploadPlaceholders.update(
        {
          status: "uploaded",
          uploadedAt: new Date(),
        },
        {
          where: {
            partnerId: req.user?.id,
            ...(["weekly", "monthly"].includes(
              req.body?.timelineDataTenure,
            ) && {
              expectedDate: {
                [Op.between]: [
                  req.body?.dateRangeFromWeeklyOrMonthly,
                  req.body?.dateRangeToWeeklyOrMonthly,
                ],
              },
            }),
            ...(req.body?.timelineDataTenure === "daily" && {
              expectedDate: req.body?.uploadDate,
            }),
            fileType: req.body?.timelineDataTenure,
            status: {
              [Op.in]: ["pending", "missed"],
            },
          },
          raw: true,
          returning: true,
        },
      );
    return updatePlaceholders;
  },

  fetchAllSellersWithOrdersAddedByPartner: async (req: any) => {
    // ...(req.query?.sellerId && {
    //   // id: { [Op.iLike]: `%${req.query?.sellerId}%` }
    //   id: req.query?.sellerId,
    // }),
    // ...(req.query?.sellerName && {
    //   sellerName: { [Op.iLike]: `%${req.query?.sellerName}%` },
    // }),
    // ...(req.query.paymentByMonthYear && {
    //   [Op.or]: [
    //     {
    //       fixedPaymentMonthYear: {
    //         [Op.eq]: req.query.paymentByMonthYear,
    //       },
    //     },
    //     {
    //       NMVPaymentMonthYear: {
    //         [Op.eq]: req.query.paymentByMonthYear,
    //       },
    //     },
    //   ],
    // }),
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        partnerId: req.user?.id,
      },
      include: [
        {
          model: db.PartnerSellersOrders,
          as: "sellerOrders",
          required: true,
        },
      ],
      // never use raw and nest properties when include used
      // instead use map and toJSON in services for parcing array
    });
    return fetchedSellers;
  },

  fetchCancelledOrHighReturnsSellersByPartner: async (req: any) => {
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        partnerId: req.user?.id,
      },
      include: [
        {
          model: db.PartnerSellersOrders,
          as: "sellerOrders",
          required: true,
          ...(JSON.parse(req.query.cancelledBySellers) && {
            where: {
              shipmentStatus: {
                [Op.eq]: "SELLER CANCELLED",
              },
            },
          }),
        },
      ],
    });
    return fetchedSellers;
  },

  fetchSellersOrderGrowthByPartner: async (req: any) => {
    const { timeTenure = "daily" } = req.query;

    const queries: any = {
      daily: `
      SELECT d::date AS label,
             COALESCE(COUNT(o.id), 0) AS orders,
             COALESCE(SUM(o.order_value), 0) AS value
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) d
      LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o ON DATE(o.created_at) = d
      AND o.sellerr_id = :sellerId
      GROUP BY d
      ORDER BY d;
    `,

      weekly: `
     SELECT
  'W' || ROW_NUMBER() OVER (ORDER BY d) AS label,
  COALESCE(COUNT(o.id), 0) AS orders,
  COALESCE(SUM(o.order_value), 0) AS value
FROM generate_series(
  date_trunc('week', CURRENT_DATE) - INTERVAL '3 weeks',
  date_trunc('week', CURRENT_DATE),
  INTERVAL '1 week'
) d
LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o
  ON date_trunc('week', o.created_at) = d
 AND o.sellerr_id = :sellerId
GROUP BY d
ORDER BY d;

    `,

      annually: `
      SELECT TO_CHAR(d, 'Mon') AS label,
             COALESCE(COUNT(o.id), 0) AS orders,
             COALESCE(SUM(o.order_value), 0) AS value
      FROM generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) d
      LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o ON date_trunc('month', o.created_at) = d
          AND o.sellerr_id = :sellerId
      GROUP BY d
      ORDER BY d;
    `,
    };

    const data = await db.sequelize.query(queries[timeTenure], {
      replacements: { sellerId: req.params.sellerId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return data;
  },

  fetchSalesReport: async (req: any) => {
    const { timeTenure = "daily" } = req.query;

    const queries: any = {
      daily: `
    WITH days AS (
      SELECT
        d::date AS date,
        TO_CHAR(d, 'Dy') AS label
      FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) d
    )
    SELECT
      days.label,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'DELIVERED' THEN o.order_value END), 0) AS delivered,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'RETURNED' THEN o.order_value END), 0) AS return,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'CANCELLED' THEN o.order_value END), 0) AS cancel,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'IN TRANSIT' THEN o.order_value END), 0) AS movement
    FROM days
    LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o
      ON DATE(o.created_at) = days.date
      AND o.sellerr_id IN (:sellerIds)
      GROUP BY days.date, days.label
      ORDER BY days.date;
      `,

      weekly: `
    WITH weeks AS (
      SELECT
        d AS week_start,
        'Week ' || ROW_NUMBER() OVER (ORDER BY d) AS label
      FROM generate_series(
        date_trunc('week', CURRENT_DATE) - INTERVAL '3 weeks',
        date_trunc('week', CURRENT_DATE),
        INTERVAL '1 week'
        ) d
        )
        SELECT
        weeks.label,
        COALESCE(SUM(CASE WHEN o.shipment_status = 'DELIVERED' THEN o.order_value END), 0) AS delivered,
        COALESCE(SUM(CASE WHEN o.shipment_status = 'RETURNED' THEN o.order_value END), 0) AS return,
        COALESCE(SUM(CASE WHEN o.shipment_status = 'CANCELLED' THEN o.order_value END), 0) AS cancel,
        COALESCE(SUM(CASE WHEN o.shipment_status = 'IN TRANSIT' THEN o.order_value END), 0) AS movement
        FROM weeks
        LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o
        ON date_trunc('week', o.created_at) = weeks.week_start
        AND o.sellerr_id IN (:sellerIds)
        GROUP BY weeks.week_start, weeks.label
        ORDER BY weeks.week_start;
      `,

      annually: `
    WITH months AS (
      SELECT
        d AS month_start,
        UPPER(TO_CHAR(d, 'Mon')) AS label
      FROM generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
      ) d
    )
    SELECT
      months.label,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'DELIVERED' THEN o.order_value END), 0) AS delivered,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'RETURNED' THEN o.order_value END), 0) AS return,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'CANCELLED' THEN o.order_value END), 0) AS cancel,
      COALESCE(SUM(CASE WHEN o.shipment_status = 'IN TRANSIT' THEN o.order_value END), 0) AS movement
      FROM months
      LEFT JOIN "raviel-local-schema"."partner_sellers_orders" o
      ON date_trunc('month', o.created_at) = months.month_start
      AND o.sellerr_id IN (:sellerIds)
      GROUP BY months.month_start, months.label
      ORDER BY months.month_start;
      `,
    };

    const fetchSellers =
      await partnerRepository.fetchAllSellersAddedByPartner(req);

    const rows = await db.sequelize.query(queries[timeTenure], {
      replacements: {
        sellerIds: fetchSellers?.map((seller: any) => seller?.id),
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    const formatChartData = (rows: any) => ({
      labels: rows.map((r: any) => r.label),
      Delivered: rows.map((r: any) => Number(r.delivered)),
      Return: rows.map((r: any) => Number(r.return)),
      Cancel: rows.map((r: any) => Number(r.cancel)),
      Movement: rows.map((r: any) => Number(r.movement)),
    });

    const data = formatChartData(rows);

    return data;
  },

  fetchAllOrdersByPartner: async (filterQuery: any) => {
    const fetchedOrders = await db.PartnerSellersOrders.findAll({
      where: {
        ...(filterQuery?.sellerId && {
          sellerrId: filterQuery?.sellerId,
        }),
        ...(filterQuery?.sellerIds && {
          sellerrId: filterQuery?.sellerIds,
        }),
        ...(filterQuery?.orderStatus && {
          shipmentStatus: filterQuery?.orderStatus,
        }),
        ...(filterQuery?.orderId && {
          id: filterQuery?.orderId,
        }),
      },
      include: [
        {
          model: db.PartnerAddedSellers,
          as: "sellerDetails",
        },
      ],
    });
    return fetchedOrders;
  },

  fetchAllSellersBySellerIds: async (sellerIds: string[]) => {
    const fetchedSellers = await db.PartnerAddedSellers.findAll({
      where: {
        sellerId: sellerIds,
      },
      raw: true,
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
        "NMVPaymentMonthYear",
      ],
    });
    return addedSellers;
  },
};

export default partnerRepository;
