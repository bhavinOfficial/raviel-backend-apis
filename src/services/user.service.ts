import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import userBusinessDetailsRepository from "../repositories/userBusinessDetails.repository";
import partnerRepository from "../repositories/partner.repository";
import db from "../models";

const userService = {
  // registerUser: async (req: Request) => {
  //   const hashPassword = await helper.hashPassword({
  //     password: req.body.password,
  //   });
  //   req.body.password = hashPassword;
  //   const createdUser = (await userRepository.registerUser(req)).toJSON();
  //   delete createdUser.password;

  //   const insertPlaceholder = async (
  //     partnerId: string,
  //     type: string,
  //     date: Date,
  //   ) => {

  //     // normalize date
  //     const expectedDate = new Date(date);
  //     expectedDate.setHours(0, 0, 0, 0);
  //   };

  //   const startOfWeek = (date: Date): Date => {
  //     const d = new Date(date);
  //     d.setHours(0, 0, 0, 0);

  //     const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  //     const diff = day === 0 ? -6 : 1 - day;

  //     d.setDate(d.getDate() + diff);
  //     return d;
  //   };

  //   const startOfMonth = (date: Date): Date => {
  //     const d = new Date(date);
  //     d.setHours(0, 0, 0, 0);
  //     d.setDate(1);
  //     return d;
  //   };

  //   const createInitialPlaceholders = async (
  //     partnerId: string,
  //     startDate: Date,
  //   ) => {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     // ===== DAILY =====
  //     const dailyDate = new Date(startDate);
  //     dailyDate.setHours(0, 0, 0, 0);

  //     for (
  //       let d = new Date(dailyDate);
  //       d <= today;
  //       d.setDate(d.getDate() + 1)
  //     ) {
  //       await insertPlaceholder(partnerId, "daily", d);
  //     }

  //     // ===== WEEKLY =====
  //     let weekStart = startOfWeek(startDate);
  //     while (weekStart <= today) {
  //       await insertPlaceholder(partnerId, "weekly", weekStart);
  //       weekStart = new Date(weekStart);
  //       weekStart.setDate(weekStart.getDate() + 7);
  //     }

  //     // ===== MONTHLY =====
  //     let monthStart = startOfMonth(startDate);
  //     while (monthStart <= today) {
  //       await insertPlaceholder(partnerId, "monthly", monthStart);
  //       monthStart = new Date(monthStart);
  //       monthStart.setMonth(monthStart.getMonth() + 1);
  //     }
  //   };

  //   // const createInitialPlaceholders = async (
  //   //   partnerId: string,
  //   //   startDate: Date,
  //   // ) => {
  //   //   const today = new Date();
  //   //   today.setHours(0, 0, 0, 0);

  //   //   // DAILY
  //   //   for (let d = startDate; d <= today; d.setDate(d.getDate() + 1)) {
  //   //     await insertPlaceholder(partnerId, "daily", new Date(d));
  //   //   }

  //   //   // WEEKLY
  //   //   let weekStart = startOfWeek(startDate);
  //   //   while (weekStart <= today) {
  //   //     await insertPlaceholder(partnerId, "weekly", weekStart);
  //   //     weekStart.setDate(weekStart.getDate() + 7);
  //   //   }

  //   //   // MONTHLY
  //   //   let monthStart = startOfMonth(startDate);
  //   //   while (monthStart <= today) {
  //   //     await insertPlaceholder(partnerId, "monthly", monthStart);
  //   //     monthStart.setMonth(monthStart.getMonth() + 1);
  //   //   }
  //   // };

  //   const partnerId = createdUser.id;
  //   const registeredAt = new Date(createdUser.createdAt);

  //   await createInitialPlaceholders(partnerId, registeredAt);

  //   return createdUser;
  // },

  registerUser: async (req: Request) => {
    // 1️⃣ Create user
    const hashPassword = await helper.hashPassword({
      password: req.body.password,
    });

    req.body.password = hashPassword;

    const createdUser = (await userRepository.registerUser(req)).toJSON();
    delete createdUser.password;

    const partnerId = createdUser.id;
    const registeredAt = new Date(createdUser.createdAt);

    // ==============================
    // 🔧 HELPERS
    // ==============================

    const normalizeDate = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const startOfWeek = (date: Date) => {
      const d = normalizeDate(date);
      const day = d.getDay(); // Sun=0
      const diff = day === 0 ? -6 : 1 - day; // Monday start
      d.setDate(d.getDate() + diff);
      return d;
    };

    const startOfMonth = (date: Date) => {
      const d = normalizeDate(date);
      d.setDate(1);
      return d;
    };

    const insertPlaceholder = async (
      partnerId: string,
      fileType: "daily" | "weekly" | "monthly",
      expectedDate: Date,
    ) => {
      await db.PartnerExcelFileUploadPlaceholders.upsert({
        partnerId,
        fileType,
        expectedDate: normalizeDate(expectedDate),
        status: "pending",
      });
    };

    // ==============================
    // 📦 CREATE INITIAL PLACEHOLDERS
    // ==============================

    const createInitialPlaceholders = async (
      partnerId: string,
      startDate: Date,
    ) => {
      const today = normalizeDate(new Date());

      // 🔹 DAILY (ONLY today)
      await insertPlaceholder(partnerId, "daily", normalizeDate(startDate));

      // 🔹 WEEKLY (week where registration happened)
      const weekStart = startOfWeek(startDate);
      await insertPlaceholder(partnerId, "weekly", weekStart);

      // 🔹 MONTHLY (month where registration happened)
      const monthStart = startOfMonth(startDate);
      await insertPlaceholder(partnerId, "monthly", monthStart);
    };

    await createInitialPlaceholders(partnerId, registeredAt);

    return createdUser;
  },

  loginUser: async (req: Request, res: Response) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    const isValidPassword = await helper.comparePassword({
      password: req.body.password,
      hashedPassword: user.password,
    });

    if (!isValidPassword) return message.INVALID_CREDENTIALS;

    await userRepository.updateUser({ lastLoginDate: new Date() }, user?.id);

    delete user.password;

    const accessToken = await helper.generateToken({
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   maxAge: 15 * 60 * 1000,
    // });

    return { accessToken };
  },

  updateUser: async (req: any) => {
    const userInfo = {
      ...(req.body.firstName && { firstName: req.body.firstName }),
      ...(req.body.lastName && { lastName: req.body.lastName }),
      ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber }),
    };

    const userBusinessInfo = {
      ...(req.body.businessName && { businessName: req.body.businessName }),
      ...(req.body.gstNumber && { gstNumber: req.body.gstNumber }),
      ...(req.body.gstAddress && { gstAddress: req.body.gstAddress }),
      ...(req.body.manufacturerNumber && {
        manufacturerNumber: req.body.manufacturerNumber,
      }),
      ...(req.body.fullFillerNumber && {
        fullFillerNumber: req.body.fullFillerNumber,
      }),
      ...(req.body.pickupAddress && { pickupAddress: req.body.pickupAddress }),
      ...(req.body.businessType && { businessType: req.body.businessType }),
      ...(req.body.pancardNumber && { pancardNumber: req.body.pancardNumber }),
      ...(req.body.managerPhoneNumber && {
        managerPhoneNumber: req.body.managerPhoneNumber,
      }),
      ...(req.body.managerEmail && { managerEmail: req.body.managerEmail }),
    };

    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    if (Object.keys(userInfo).length) {
      const updatedUserInfo = await userRepository.updateUser(
        userInfo,
        user?.id,
      );
      if (!updatedUserInfo) return message.FAILED;
    }

    if (Object.keys(userBusinessInfo).length) {
      const updatedUserBusinessInfo =
        await userBusinessDetailsRepository.updateUserBusinessDetails(
          userBusinessInfo,
          user?.id,
        );
      if (!updatedUserBusinessInfo) return message.FAILED;
    }

    return true;
  },

  getLoggedInUserDetails: async (req: any) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    delete user.password;
    if (user.role === "partner") {
      let allSellersOfPartner =
        await partnerRepository.fetchAllSellersWithOrdersAddedByPartner(req);

      allSellersOfPartner = allSellersOfPartner.map((item: any) =>
        item.get({ plain: true }),
      );

      // const data = allSellersOfPartner.reduce((acc: any, curr: any) => {
      //   if (!acc[curr?.shipmentStatus]) {
      //     acc[curr?.shipmentStatus] = 1;
      //   } else {
      //     acc[curr?.shipmentStatus] += 1;
      //   }

      //   if (!acc[curr?.modeOfPayment]) {
      //     acc[curr?.modeOfPayment] = 1;
      //   } else {
      //     acc[curr?.modeOfPayment] += 1;
      //   }

      //   return acc;
      // }, {});

      let totalOrders = 0;
      let totalGMV = 0;
      let pendingAcceptance = 0;
      let myPayment = 0;
      let problematicOrder = 0;
      let cancelledBySellers = 0;
      let highReturn = 0;
      let inactiveSellers = 0;
      let returnOrders = 0;

      allSellersOfPartner.map((seller: any) => {
        if (seller?.sellerStatus === "inactive") {
          inactiveSellers += 1;
        }
        if (seller?.sellerOrders.length) {
          const returnOrdersOfSeller = seller?.sellerOrders.filter(
            (order: any) =>
              [
                "RETURNED",
                "REFUNDED",
                "RTO INITIATED",
                "RTO IN TRANSIT",
                "RTO COMPLETED",
              ].includes(order?.shipmentStatus),
          );

          const percentageOfReturnOrder =
            ((returnOrdersOfSeller?.length ?? 0) /
              (seller?.sellerOrders.length ?? 0)) *
            100;

          if (percentageOfReturnOrder >= 20) {
            highReturn += 1;
          }
          const findIfSellerCancelledOrder = seller.sellerOrders.some(
            (order: any) => order?.shipmentStatus === "SELLER CANCELLED",
          );
          if (findIfSellerCancelledOrder) {
            cancelledBySellers += 1;
          }
          totalOrders += seller?.sellerOrders?.length;
          for (const order of seller?.sellerOrders) {
            totalGMV += Number(order?.orderValue) ?? 0;
            if (
              [
                "PLACED",
                "SELLER PROCESSING",
                "BAG_PICKED",
                "BAG_PACKED",
                "DP_ASSIGNED",
              ].includes(order?.shipmentStatus)
            ) {
              pendingAcceptance += 1;
            }
            if (
              [
                "RETURNED",
                "REFUNDED",
                "RTO INITIATED",
                "RTO IN TRANSIT",
                "RTO COMPLETED",
              ].includes(order?.shipmentStatus)
            ) {
              returnOrders += 1;
            }
            if (!order?.shipmentStatus) {
              problematicOrder += 1;
            }
          }
        }
        myPayment +=
          (seller?.fixedPaymentAmount ?? 0) + (seller?.NMVPaymentAmount ?? 0);
      });

      user.totalOrders = totalOrders;
      user.totalGMV = totalGMV;
      user.pendingAcceptance = pendingAcceptance;
      user.myPayment = myPayment;
      user.problematicOrder = problematicOrder;
      user.cancelledBySellers = cancelledBySellers;
      user.highReturn = highReturn;
      user.InactiveSellers = inactiveSellers;
      user.returnOrders = returnOrders;
      user.returnOrderPercentage =
        ((returnOrders ?? 0) / (totalOrders ?? 0)) * 100;

      user.totalFixedPayment = Number(user?.totalFixedPayment ?? 0) ?? 0;
      user.totalNMVPayment = Number(user?.totalNMVPayment ?? 0) ?? 0;
      user.finalPayout = Number(user?.finalPayout ?? 0) ?? 0;
    }

    return user;
  },
};

export default userService;
