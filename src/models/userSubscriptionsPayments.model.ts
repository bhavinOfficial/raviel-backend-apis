import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const UserSubscriptionsPayments = (sequelize: Sequelize, DataTypes: any) => {
  class UserSubscriptionsPayments extends Model {
    public id!: string;
    public userSubscriptionId!: string;
    public razorpayPaymentId!: string;
    public razorpayInvoiceId!: string;
    public amount!: number;
    public currency!: string;
    public status!: string;
    public method!: string;
    public payload!: object;
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

  UserSubscriptionsPayments.init(
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
          key: "id"
        }
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
      },
      amount: {
        type: DataTypes.INTEGER,
        field: "amount",
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        field: "currency",
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("created", "authorized", "captured", "failed", "refunded"),
        field: "status",
        allowNull: false,
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
      modelName: "UserSubscriptionsPayments",
      tableName: "user_subscriptions_payments",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return UserSubscriptionsPayments;
};

export default UserSubscriptionsPayments;
