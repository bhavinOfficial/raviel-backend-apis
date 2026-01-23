import { Request, Response } from "express";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import subscriptionRepository from "../repositories/subscriptions.repository";
import userRepository from "../repositories/user.repository";
import razorpay from "../config/razorpay.config";
import config from "../config/env.config";
import userSubscriptionRepository from "../repositories/userSubscriptions.repository";
import crypto from "crypto";
import { setDefaultAutoSelectFamily } from "net";
import subscriptionsPaymentsRepository from "../repositories/subscriptionsPayments.repository";
import { v4 as uuidv4 } from 'uuid';

const subscriptionService = {
  fetchSubscriptionPlans: async (req: Request) => {
    const fetchedPlans = await subscriptionRepository.fetchSubscriptionPlans(req);

    if (!fetchedPlans) return message.FAILED;

    const senitizedData: any = {};

    if (req.query.userType === "partner") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "seller") {
      senitizedData[req.query.userType] = fetchedPlans;
    }
    if (req.query.userType === "all") {
      senitizedData.partnerPlans = fetchedPlans.filter((plan: any) => plan.userType === "partner").sort((planA: any, planB: any) => planA.displayOrder - planB.displayOrder);
      senitizedData.sellerPlans = fetchedPlans.filter((plan: any) => plan.userType === "seller").sort((planA: any, planB: any) => planA.displayOrder - planB.displayOrder);
    }

    return senitizedData;
  },

  createSubscription: async (req: any) => {

    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    const subscriptionPlan = await subscriptionRepository.fetchSubscriptionPlan(req);

    if (!subscriptionPlan) return "Subscription plan not found!";

    if (!user?.razorpayCustomerId) {

      let customer;

      try {
        customer = await razorpay.customers.create({
          email: user?.email
        });


      } catch (error: any) {
        throw {
          statusCode: error.statusCode || 400,
          message: error.error?.description,
          provider: "RAZORPAY",
          raw: error,
        };
      }

      const updateUser = await userRepository.updateUser({ razorpayCustomerId: customer?.id }, req.user?.id);
    }

    let subscription;


    try {
      subscription = await razorpay.subscriptions.create({
        plan_id: subscriptionPlan?.razorpayPlanId,
        customer_notify: 1,
        total_count: 1,
      });

    } catch (error: any) {
      throw {
        statusCode: error.statusCode || 400,
        message: error.error?.description,
        provider: "RAZORPAY",
        raw: error,
      };
    }

    const createdUserSubscription = await userSubscriptionRepository.createUserSubscription({
      userId: req.user?.id,
      subscriptionPlanId: subscriptionPlan?.id,
      razorpaySubscriptionId: subscription?.id,
      razorpayPlanId: subscriptionPlan?.razorpayPlanId,
      status: subscription?.status,
    });

    return {
      subscriptionId: subscription.id,
      razorpayKey: config.razorpay_key_id
    };
  },

  verifyPayment: async (req: any) => {
    const { razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature } = req.body;

    // 1️⃣ Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", config.razorpay_key_secret)
      .update(
        razorpay_payment_id + "|" + razorpay_subscription_id
      )
      .digest("hex");

    // 2️⃣ Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return "Invalid signature";
    }

    const userSubscription = await userSubscriptionRepository.fetchUserSubscription(razorpay_subscription_id);

    await userSubscriptionRepository.updateUserSubscription({
      status: "pending_confirmation"
    }, userSubscription?.id);

    return true;
  },

  handleRazorpayWebhookEvents: async (event: any) => {
    const eventType = event.event;

    switch (eventType) {
      case "payment.authorized": {
        const createdSubscriptionPaymentIntent = await subscriptionsPaymentsRepository.createSubscriptionPaymentIntent({
          razorpayPaymentId: event.payload.payment.entity.id,
          razorpayInvoiceId: event.payload.payment.entity.invoice_id,
          amount: event.payload.payment.entity.amount,
          currency: event.payload.payment.entity.currency,
          status: event.payload.payment.entity.status,
          method: event.payload.payment.entity.method,
          payload: event.payload.payment.entity,
        });
        break;
      }

      case "payment.captured": {
        const updatedSubscriptionPaymentIntent = await subscriptionsPaymentsRepository.updateSubscriptionPaymentIntent({
          razorpayInvoiceId: event.payload.payment.entity.invoice_id,
          amount: event.payload.payment.entity.amount,
          currency: event.payload.payment.entity.currency,
          status: event.payload.payment.entity.status,
          method: event.payload.payment.entity.method,
          payload: event.payload.payment.entity,
        }, event.payload.payment.entity.id);

        break;
      }

      case "subscription.completed": {
        const fetchUserSubscription = await userSubscriptionRepository.fetchUserSubscription(event.payload.subscription.entity.id);
        const updatedUserSubscription = await userSubscriptionRepository.updateUserSubscription({
          status: event.payload.subscription.entity.status,
          currentPeriodStart: new Date(event.payload.subscription.entity.current_start * 1000),
          currentPeriodEnd: new Date(event.payload.subscription.entity.current_end * 1000)
        }, fetchUserSubscription?.id);

        const updatedSubscriptionPaymentIntent = await subscriptionsPaymentsRepository.updateSubscriptionPaymentIntent({
          razorpayInvoiceId: event.payload.payment.entity.invoice_id,
          amount: event.payload.payment.entity.amount,
          currency: event.payload.payment.entity.currency,
          status: event.payload.payment.entity.status,
          method: event.payload.payment.entity.method,
          payload: event.payload.payment.entity,
          userSubscriptionId: fetchUserSubscription?.id
        }, event.payload.payment.entity.id);
        break;
      }

      case "subscription.activated": {
        const fetchUserSubscription = await userSubscriptionRepository.fetchUserSubscription(event.payload.subscription.entity.id);
        const updatedUserSubscription = await userSubscriptionRepository.updateUserSubscription({
          status: event.payload.subscription.entity.status,
          currentPeriodStart: new Date(event.payload.subscription.entity.current_start * 1000),
          currentPeriodEnd: new Date(event.payload.subscription.entity.current_end * 1000)
        }, fetchUserSubscription?.id);

        const updatedSubscriptionPaymentIntent = await subscriptionsPaymentsRepository.updateSubscriptionPaymentIntent({
          razorpayInvoiceId: event.payload.payment.entity.invoice_id,
          amount: event.payload.payment.entity.amount,
          currency: event.payload.payment.entity.currency,
          status: event.payload.payment.entity.status,
          method: event.payload.payment.entity.method,
          payload: event.payload.payment.entity,
          userSubscriptionId: fetchUserSubscription?.id
        }, event.payload.payment.entity.id);
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
