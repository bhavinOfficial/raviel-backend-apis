import { Request, Response } from "express";
import { message } from "../common/constants";
import subscriptionRepository from "../repositories/subscriptions.repository";
import userRepository from "../repositories/user.repository";
import razorpay from "../config/razorpay.config";
import config from "../config/env.config";
import userSubscriptionRepository from "../repositories/userSubscriptions.repository";
import subscriptionsPaymentsInvoicesRepository from "../repositories/subscriptionsPaymentsInvoices.repository";
import crypto from "crypto";

const subscriptionService = {
  fetchSubscriptionPlans: async (req: Request) => {
    const fetchedPlans =
      await subscriptionRepository.fetchSubscriptionPlans(req);

    if (!fetchedPlans) return message.FAILED;

    const senitizedData: any = {};

    if (req.query.userType === "partner") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "seller") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "all") {
      senitizedData.partnerPlans = fetchedPlans
        .filter((plan: any) => plan.userType === "partner")
        .sort(
          (planA: any, planB: any) => planA.displayOrder - planB.displayOrder,
        );
      senitizedData.sellerPlans = fetchedPlans
        .filter((plan: any) => plan.userType === "seller")
        .sort(
          (planA: any, planB: any) => planA.displayOrder - planB.displayOrder,
        );
    }

    return senitizedData;
  },

  createSubscription: async (req: any) => {
    // const user = await userRepository.findUser(req);

    // if (!user) return message.USER_NOT_FOUND;

    const subscriptionPlan =
      await subscriptionRepository.fetchSubscriptionPlan(req);

    if (!subscriptionPlan) return "Subscription plan not found!";

    if (!req.user?.razorpayCustomerId) {
      let customer;

      try {
        customer = await razorpay.customers.create({
          email: req.user?.email,
        });
      } catch (error: any) {
        throw {
          statusCode: error.statusCode || 400,
          message: error.error?.description,
          provider: "RAZORPAY",
          raw: error,
        };
      }

      const updateUser = await userRepository.updateUser(
        { razorpayCustomerId: customer?.id },
        req.user?.id,
      );
    }

    let subscription;

    try {
      subscription = await razorpay.subscriptions.create({
        plan_id: subscriptionPlan?.razorpayPlanId,
        customer_notify: 1,
        total_count: req.body.recurringCount,
      });
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 400,
        message: error.error?.description,
        provider: "RAZORPAY",
        raw: error,
      };
    }

    const createdUserSubscription =
      await userSubscriptionRepository.createUserSubscription({
        userId: req.user?.id,
        subscriptionPlanId: subscriptionPlan?.id,
        razorpaySubscriptionId: subscription?.id,
        razorpayPlanId: subscriptionPlan?.razorpayPlanId,
        status: subscription?.status,
        billingInterval: subscriptionPlan?.planType,
      });

    return {
      subscriptionId: subscription.id,
      razorpayKey: config.razorpay_key_id,
    };
  },

  cancelSubscription: async (req: any) => {
    const userSubscriptionPlan =
      await userSubscriptionRepository.fetchUserSubscription(
        req.body?.razorpaySubscriptionId,
      );

    if (!userSubscriptionPlan) return "User's Subscription plan not found!";

    try {
      // const razorpayResponse = await razorpay.subscriptions.cancel(
      //   userSubscriptionPlan?.razorpaySubscriptionId,
      //   { cancel_at_cycle_end: 0 },
      // );
      const razorpayResponse = await razorpay.subscriptions.cancel(
        userSubscriptionPlan.razorpaySubscriptionId,
        false, // false for cancel immediate and refund for rest and true for cancel at end of billing cycle
      );
    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 400,
        message: error.error?.description,
        provider: "RAZORPAY",
        raw: error,
      };
    }

    return;
  },

  checkoutUICloseOrPaymentFailed: async (req: any) => {
    // const user = await userRepository.findUser(req);

    // if (!user) return message.USER_NOT_FOUND;

    // const subscriptionPlan =
    //   await subscriptionRepository.fetchSubscriptionPlan(req);

    // if (!subscriptionPlan) return "Subscription plan not found!";

    const deletedSubscriptionPlan =
      await subscriptionRepository.deleteSubscription(req);

    if (deletedSubscriptionPlan) {
      return true;
    } else {
      return false;
    }
  },

  verifySubscription: async (req: any) => {
    const { razorpayPaymentId, razorpaySubscriptionId, razorpaySignature } =
      req.body;

    // 1️⃣ Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", config.razorpay_key_secret)
      .update(razorpayPaymentId + "|" + razorpaySubscriptionId)
      .digest("hex");

    // 2️⃣ Compare signatures
    if (generatedSignature !== razorpaySignature) {
      return "Invalid signature";
    }

    // const userSubscription =
    //   await userSubscriptionRepository.fetchUserSubscription(
    //     razorpaySubscriptionId,
    //   );

    // await userSubscriptionRepository.updateUserSubscription(
    //   {
    //     status: "pending_confirmation",
    //   },
    //   userSubscription?.id,
    // );

    return true;
  },

  handleRazorpayWebhookEvents: async (event: any) => {
    const eventType = event.event;
    console.log(
      "🚀 ~ eventType:",
      eventType,
      " event: ",
      JSON.stringify(event, null, 2),
    );

    switch (eventType) {
      case "invoice.paid": {
        const purchasedSubscriptionPlan =
          await subscriptionRepository.fetchUserSubscription(
            event.payload.invoice.entity.subscription_id,
          );

        if (!purchasedSubscriptionPlan) return "User subscription not found!";

        const updatedSubscriptionPaymentIntent =
          await subscriptionsPaymentsInvoicesRepository.upsertSubscriptionPaymentInvoice(
            {
              userSubscriptionId: purchasedSubscriptionPlan?.id,
              razorpayPaymentId: event.payload.payment.entity?.id,
              razorpayInvoiceId: event.payload.invoice.entity?.id,
              razorpayOrderId: event.payload.order.entity?.id,
              amount: event.payload.payment.entity?.amount,
              razorpayFee: event.payload.payment.entity?.fee,
              razorpayTax: event.payload.payment.entity?.tax,
              netAmount:
                (event.payload.payment.entity?.amount ?? 0) -
                ((event.payload.payment.entity?.fee ?? 0) +
                  (event.payload.payment.entity?.tax ?? 0)),
              currency: event.payload.payment.entity.currency,
              status: event.payload.invoice.entity.status,
              paidAt:
                event.payload.invoice.entity?.paid_at &&
                new Date(event.payload.invoice.entity.paid_at * 1000),
              method: event.payload.payment.entity?.method,
              payload: event.payload,
            },
          );
        break;
      }

      case "invoice.expired": {
        const purchasedSubscriptionPlan =
          await subscriptionRepository.fetchUserSubscription(
            event.payload.invoice.entity?.subscription_id,
          );

        if (!purchasedSubscriptionPlan) return "User subscription not found!";

        const updatedSubscriptionPaymentIntent =
          await subscriptionsPaymentsInvoicesRepository.upsertSubscriptionPaymentInvoice(
            {
              userSubscriptionId: purchasedSubscriptionPlan?.id,
              razorpayPaymentId: event.payload.payment.entity?.id,
              razorpayInvoiceId: event.payload.invoice.entity?.id,
              razorpayOrderId: event.payload.order.entity?.id,
              amount: event.payload.payment.entity?.amount,
              razorpayFee: event.payload.payment.entity?.fee,
              razorpayTax: event.payload.payment.entity?.tax,
              netAmount:
                (event.payload.payment.entity?.amount ?? 0) -
                ((event.payload.payment.entity?.fee ?? 0) +
                  (event.payload.payment.entity?.tax ?? 0)),
              currency: event.payload.payment.entity?.currency,
              status: "failed",
              paidAt:
                event.payload.invoice.entity?.paid_at &&
                new Date(event.payload.invoice.entity?.paid_at * 1000),
              method: event.payload.payment.entity?.method,
              payload: event.payload,
            },
          );
        break;
      }

      case "subscription.activated": {
        const fetchUserSubscription =
          await userSubscriptionRepository.fetchUserSubscription(
            event.payload.subscription.entity?.id,
          );

        if (!fetchUserSubscription) return "User subscription not found!";

        const updatedUserSubscription =
          await userSubscriptionRepository.updateUserSubscription(
            {
              status: event.payload.subscription.entity?.status,
              currentPeriodStart:
                event.payload.subscription.entity?.current_start &&
                new Date(
                  event.payload.subscription.entity?.current_start * 1000,
                ),
              currentPeriodEnd:
                event.payload.subscription.entity?.current_end &&
                new Date(event.payload.subscription.entity?.current_end * 1000),
              startAt:
                event.payload.subscription.entity?.start_at &&
                new Date(event.payload.subscription.entity?.start_at * 1000),
              endAt:
                event.payload.subscription.entity?.end_at &&
                new Date(event.payload.subscription.entity?.end_at * 1000),
              totalCount: event.payload.subscription.entity?.total_count,
              paidCount: event.payload.subscription.entity?.paid_count,
              remainingCount:
                event.payload.subscription.entity?.remaining_count,
            },
            fetchUserSubscription?.id,
          );

        const updatedSubscriptionPaymentIntent =
          await subscriptionsPaymentsInvoicesRepository.updateSubscriptionPaymentInvoice(
            {
              billingPeriodStart:
                event.payload.subscription.entity?.current_start &&
                new Date(
                  event.payload.subscription.entity?.current_start * 1000,
                ),
              billingPeriodEnd:
                event.payload.subscription.entity?.current_end &&
                new Date(event.payload.subscription.entity?.current_end * 1000),
            },
            event.payload.payment.entity?.invoice_id,
          );
        break;
      }

      case "subscription.charged": {
        const fetchUserSubscription =
          await userSubscriptionRepository.fetchUserSubscription(
            event.payload.subscription.entity?.id,
          );
        if (!fetchUserSubscription) return "User subscription not found!";

        const updatedUserSubscription =
          await userSubscriptionRepository.updateUserSubscription(
            {
              status: event.payload.subscription.entity?.status,
              currentPeriodStart:
                event.payload.subscription.entity?.current_start &&
                new Date(
                  event.payload.subscription.entity?.current_start * 1000,
                ),
              currentPeriodEnd:
                event.payload.subscription.entity?.current_end &&
                new Date(event.payload.subscription.entity?.current_end * 1000),
              totalCount: event.payload.subscription.entity?.total_count,
              paidCount: event.payload.subscription.entity?.paid_count,
              remainingCount:
                event.payload.subscription.entity?.remaining_count,
            },
            fetchUserSubscription?.id,
          );
        break;
      }

      case "subscription.halted": {
        const fetchUserSubscription =
          await userSubscriptionRepository.fetchUserSubscription(
            event.payload.subscription.entity?.id,
          );

        if (!fetchUserSubscription) return "User subscription not found!";

        const updatedUserSubscription =
          await userSubscriptionRepository.updateUserSubscription(
            {
              status: event.payload.subscription.entity?.status,
              haltedAt: new Date(),
            },
            fetchUserSubscription?.id,
          );
        break;
      }

      case "subscription.completed": {
        const fetchUserSubscription =
          await userSubscriptionRepository.fetchUserSubscription(
            event.payload.subscription.entity?.id,
          );

        if (!fetchUserSubscription) return "User subscription not found!";

        const updatedUserSubscription =
          await userSubscriptionRepository.updateUserSubscription(
            {
              status: event.payload.subscription.entity?.status,
              completedAt:
                event.payload.subscription.entity?.ended_at &&
                new Date(event.payload.subscription.entity?.ended_at * 1000),
            },
            fetchUserSubscription?.id,
          );
        break;
      }

      case "subscription.cancelled": {
        const fetchUserSubscription =
          await userSubscriptionRepository.fetchUserSubscription(
            event.payload.subscription.entity?.id,
          );

        if (!fetchUserSubscription) return "User subscription not found!";

        const updatedUserSubscription =
          await userSubscriptionRepository.updateUserSubscription(
            {
              status: event.payload.subscription.entity?.status,
              cancelledAt:
                event.payload.subscription.entity?.ended_at &&
                new Date(event.payload.subscription.entity?.ended_at * 1000),
            },
            fetchUserSubscription?.id,
          );

        // 2️⃣ Calculate refund
        const now: any = new Date(
          event.payload.subscription.entity?.ended_at * 1000,
        );
        const totalDays =
          (fetchUserSubscription.currentPeriodEnd -
            fetchUserSubscription.currentPeriodStart) /
          (1000 * 60 * 60 * 24);

        const usedDays =
          (now - fetchUserSubscription.currentPeriodStart) /
          (1000 * 60 * 60 * 24);

        const refundableAmount = Math.floor(
          fetchUserSubscription.amount * ((totalDays - usedDays) / totalDays),
        );

        // 3️⃣ Refund last payment
        const lastInvoice =
          await subscriptionsPaymentsInvoicesRepository.fetchPaymentInvoice({
            subscriptionId: fetchUserSubscription.id,
            status: "paid",
            billingPeriodStart: fetchUserSubscription?.currentPeriodStart,
            billingPeriodEnd: fetchUserSubscription?.currentPeriodEnd,
          });

        let refund;

        if (lastInvoice && refundableAmount > 0) {
          refund = await razorpay.payments.refund(
            lastInvoice.razorpayPaymentId,
            {
              amount: refundableAmount,
            },
          );
        }

        // 4️⃣ Update invoice
        await subscriptionsPaymentsInvoicesRepository.updateSubscriptionPaymentInvoice(
          {
            status: "refund_initiated",
            refundedAmount: refundableAmount,
            razorpayRefundId: refund?.id,
          },
          lastInvoice.id,
        );
        break;
      }

      case "refund.processed": {
        const refund = event.payload.refund.entity;

        await subscriptionsPaymentsInvoicesRepository.updateSubscriptionPaymentInvoiceByRefundId(
          {
            status: "refunded",
            refundedAt: new Date(refund?.created_at * 1000),
          },
          refund?.id,
        );
        break;
      }

      case "refund.failed": {
        const refund = event.payload.refund.entity;

        await subscriptionsPaymentsInvoicesRepository.updateSubscriptionPaymentInvoiceByRefundId(
          {
            status: "refund_failed",
          },
          refund?.id,
        );
        break;
      }

      default: {
        console.log("Unhandled Razorpay event:", eventType);
      }
    }
    return true;
  },
};

export default subscriptionService;
