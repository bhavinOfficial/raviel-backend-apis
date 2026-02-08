import { Request } from "express";
import db from "../models";

const subscriptionsPaymentsInvoicesRepository = {
  createSubscriptionPaymentIntent: async (dataToAdd: any) => {
    return await db.UserSubscriptionsPayments.create(dataToAdd);
  },

  updateSubscriptionPaymentInvoice: async (
    dataToUpdate: any,
    razorpayInvoiceId: string,
  ) => {
    return await db.UserSubscriptionsPaymentsInvoices.update(dataToUpdate, {
      where: {
        razorpayInvoiceId,
      },
      raw: true,
      returning: true,
    });
  },

  updateSubscriptionPaymentInvoiceByRefundId: async (
    dataToUpdate: any,
    razorpayRefundId: string,
  ) => {
    return await db.UserSubscriptionsPaymentsInvoices.update(dataToUpdate, {
      where: {
        razorpayRefundId,
      },
      raw: true,
      returning: true,
    });
  },

  fetchPaymentInvoice: async (dataToFind: any) => {
    return await db.UserSubscriptionsPaymentsInvoices.findOne({
      where: {
        ...dataToFind,
      },
      order: [["createdAt", "DESC"]],
      raw: true,
    });
  },

  upsertSubscriptionPaymentInvoice: async (dataToUpdate: any) => {
    return await db.UserSubscriptionsPaymentsInvoices.upsert(dataToUpdate, {
      conflictFields: ["razorpay_invoice_id"],
      returning: true,
    });
  },
};

export default subscriptionsPaymentsInvoicesRepository;
