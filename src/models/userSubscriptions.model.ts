import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const UserSubscriptions = (sequelize: Sequelize, DataTypes: any) => {
  class UserSubscriptions extends Model {
    public id!: string;
    public userId!: string;
    public subscriptionPlanId!: string;
    public razorpaySubscriptionId!: string;
    public razorpayPlanId!: string;
    public status!: string;
    public totalCount!: number;
    public billingInterval!: string;
    public paidCount!: number;
    public remainingCount!: number;
    public cancelledAt!: string;
    public completedAt!: string;
    public haltedAt!: string;
    public currentPeriodStart!: string;
    public currentPeriodEnd!: string;
    public startAt!: string;
    public endAt!: string;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    // toJSON() {
    //   let attributes = Object.assign({}, this.get());
    //   delete attributes.password_hash;
    //   return attributes;
    // }

    static associate(models: any) {
      //* define association here
      UserSubscriptions.belongsTo(models.SubscriptionPlans, {
        foreignKey: "subscriptionPlanId",
        as: "subscriptionPlanDetails",
      });
    }
  }

  UserSubscriptions.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        field: "user_id",
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      subscriptionPlanId: {
        type: DataTypes.UUID,
        field: "subscription_plan_id",
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "id",
        },
      },
      billingInterval: {
        type: DataTypes.ENUM("monthly", "quarterly", "yearly", "half-yearly"),
        field: "billing_interval",
        allowNull: true,
      },

      razorpaySubscriptionId: {
        type: DataTypes.STRING,
        field: "razorpay_subscription_id",
        allowNull: false,
      },
      razorpayPlanId: {
        type: DataTypes.STRING,
        field: "razorpay_plan_id",
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "created",
          // "pending_confirmation",
          "active",
          "halted",
          "completed",
          "cancelled",
        ),
        field: "status",
        allowNull: false,
      },
      currentPeriodStart: {
        type: DataTypes.DATE,
        field: "current_period_start",
        allowNull: true,
      },
      currentPeriodEnd: {
        type: DataTypes.DATE,
        field: "current_period_end",
        allowNull: true,
      },
      startAt: {
        type: DataTypes.DATE,
        field: "start_at",
        allowNull: true,
      },
      endAt: {
        type: DataTypes.DATE,
        field: "end_at",
        allowNull: true,
      },
      totalCount: {
        type: DataTypes.INTEGER,
        field: "total_count",
        allowNull: true,
        defaultValue: 0,
      },
      paidCount: {
        type: DataTypes.INTEGER,
        field: "paid_count",
        allowNull: true,
        defaultValue: 0,
      },
      remainingCount: {
        type: DataTypes.INTEGER,
        field: "remaining_count",
        allowNull: true,
        defaultValue: 0,
      },
      cancelledAt: {
        type: DataTypes.DATE,
        field: "cancelled_at",
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        field: "completed_at",
        allowNull: true,
      },
      haltedAt: {
        type: DataTypes.DATE,
        field: "halted_at",
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
      modelName: "UserSubscriptions",
      tableName: "user_subscriptions",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return UserSubscriptions;
};

export default UserSubscriptions;
