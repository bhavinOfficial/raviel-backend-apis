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
    public currentPeriodStart!: string;
    public currentPeriodEnd!: number;
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
          key: "id"
        }
      },
      subscriptionPlanId: {
        type: DataTypes.UUID,
        field: "subscription_plan_id",
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "id"
        }
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
        type: DataTypes.ENUM("created", "pending_confirmation", "active", "completed", "cancelled", "failed"),
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
    }
  );
  return UserSubscriptions;
};

export default UserSubscriptions;
