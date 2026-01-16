import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const SubscriptionPlanKeyFeatures = (sequelize: Sequelize, DataTypes: any) => {
  class SubscriptionPlanKeyFeatures extends Model {
    public id!: string;
    public subscriptionPlanId!: string;
    public displayOrder!: number;
    public featureName!: string;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    // toJSON() {
    //   let attributes = Object.assign({}, this.get());
    //   delete attributes.password_hash;
    //   return attributes;
    // }

    static associate(models: any) {
      //* define association here
      //   User.belongsTo(models.Role, {
      //     foreignKey: "role_id",
      //     as: "role",
      //   });
    }
  }

  SubscriptionPlanKeyFeatures.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subscriptionPlanId: {
        type: DataTypes.STRING,
        field: "subscription_plan_id",
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "id",
        }
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        field: "display_order",
        allowNull: false
      },
      featureName: {
        type: DataTypes.STRING,
        field: "feature_name",
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
      modelName: "SubscriptionPlanKeyFeatures",
      tableName: "subscription_plan_key_features",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return SubscriptionPlanKeyFeatures;
};

export default SubscriptionPlanKeyFeatures;
