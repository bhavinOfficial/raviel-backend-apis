import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const SubscriptionPlans = (sequelize: Sequelize, DataTypes: any) => {
  class SubscriptionPlans extends Model {
    public id!: string;
    public planName!: string;
    public planDescription!: string;
    public planType!: string;
    public planTypeMonths!: number;
    public isPopular!: boolean;
    public discountInPercentage!: number;
    public price!: number;
    public razorpayPlanId!: string;
    public displayOrder!: number;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    // toJSON() {
    //   let attributes = Object.assign({}, this.get());
    //   delete attributes.password_hash;
    //   return attributes;
    // }

    static associate(models: any) {
      //* define association here
        SubscriptionPlans.hasMany(models.SubscriptionPlanKeyFeatures, {
          foreignKey: "subscription_plan_id",
          as: "subscriptionPlanKeyFeatures",
        });
        SubscriptionPlans.hasMany(models.SubscriptionPlanIncludedServices, {
          foreignKey: "subscription_plan_id",
          as: "subscriptionPlanIncludedServices",
        });
    }
  }

  SubscriptionPlans.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planName: {
        type: DataTypes.STRING,
        field: "plan_name",
        allowNull: false,
      },
      planDescription: {
        type: DataTypes.STRING,
        field: "plan_description",
        allowNull: false,
      },
      planType: {
        type: DataTypes.ENUM("monthly", "quarterly", "half-yearly", "yearly"),
        field: "plan_type",
      },
      planTypeMonths: {
        type: DataTypes.INTEGER,
        field: "plan_type_months",
        validate: {
          isInt: true,
          min: 1,
          max: 12
        }
      },
      isPopular: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_popular",
      },
      discountInPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "discount_in_percentage",
      },
      price: {
        type: DataTypes.INTEGER,
        field: "price",
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        field: "display_order",
        allowNull: false
      },
      userType: {
        type: DataTypes.ENUM("partner", "seller"),
        field: "user_type",
        allowNull: false
      },
      razorpayPlanId: {
        type: DataTypes.STRING,
        field: "razorpay_plan_id",
        allowNull: true
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
      modelName: "SubscriptionPlans",
      tableName: "subscription_plans",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return SubscriptionPlans;
};

export default SubscriptionPlans;
