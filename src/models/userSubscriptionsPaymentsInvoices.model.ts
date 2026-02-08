import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const UserSubscriptionsPaymentsInvoices = (
  sequelize: Sequelize,
  DataTypes: any,
) => {
  class UserSubscriptionsPaymentsInvoices extends Model {
    public id!: string;
    public userSubscriptionId!: string;
    public razorpayPaymentId!: string;
    public razorpayInvoiceId!: string;
    public amount!: number;
    public razorpayFee!: number;
    public razorpayTax!: number;
    public netAmount!: number;
    public currency!: string;
    public status!: string;
    public method!: string;
    public payload!: object;
    public billingPeriodStart!: string;
    public billingPeriodEnd!: string;
    public razorpayOrderId!: string;
    public refundedAmount!: number;
    public refundedAt!: string;
    public razorpayRefundId!: string;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    // toJSON() {
    //   let attributes = Object.assign({}, this.get());
    //   delete attributes.password_hash;
    //   return attributes;
    // }

    static associate(models: any) {
      //* define association here
    }
  }

  UserSubscriptionsPaymentsInvoices.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userSubscriptionId: {
        type: DataTypes.UUID,
        field: "user_subscription_id",
        allowNull: true,
        references: {
          model: "user_subscriptions",
          key: "id",
        },
      },
      razorpayPaymentId: {
        type: DataTypes.STRING,
        field: "razorpay_payment_id",
        allowNull: true,
      },
      razorpayInvoiceId: {
        type: DataTypes.STRING,
        field: "razorpay_invoice_id",
        allowNull: true,
        unique: true,
      },
      razorpayOrderId: {
        type: DataTypes.STRING,
        field: "razorpay_order_id",
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        field: "amount",
        allowNull: true,
      },
      razorpayFee: {
        type: DataTypes.INTEGER,
        field: "razorpayFee",
        allowNull: true,
      },
      razorpayTax: {
        type: DataTypes.INTEGER,
        field: "razorpayTax",
        allowNull: true,
      },
      netAmount: {
        type: DataTypes.INTEGER,
        field: "net_amount",
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        field: "currency",
        allowNull: true,
      },
      billingPeriodStart: {
        type: DataTypes.DATE,
        field: "billing_period_start",
        allowNull: true,
      },

      billingPeriodEnd: {
        type: DataTypes.DATE,
        field: "billing_period_end",
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "created",
          "paid",
          "failed",
          "refunded",
          "refund_initiated",
          "refund_failed",
        ),
        field: "status",
        allowNull: false,
      },
      paidAt: {
        type: DataTypes.DATE,
        field: "paid_at",
        allowNull: true,
      },
      refundedAt: {
        type: DataTypes.DATE,
        field: "refunded_at",
        allowNull: true,
      },
      method: {
        type: DataTypes.STRING,
        field: "method",
        allowNull: true,
      },
      payload: {
        type: DataTypes.JSONB,
        field: "payload",
        allowNull: true,
      },
      refundedAmount: {
        type: DataTypes.INTEGER,
        field: "refunded_amount",
        allowNull: true,
      },
      refunded_at: {
        type: DataTypes.DATE,
        field: "refunded_at",
        allowNull: true,
      },
      razorpayRefundId: {
        type: DataTypes.STRING,
        field: "razorpay_refund_id",
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserSubscriptionsPaymentsInvoices",
      tableName: "user_subscriptions_payments_invoices",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return UserSubscriptionsPaymentsInvoices;
};

export default UserSubscriptionsPaymentsInvoices;
