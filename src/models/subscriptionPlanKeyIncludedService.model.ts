import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const SubscriptionPlanIncludedServices = (sequelize: Sequelize, DataTypes: any) => {
  class SubscriptionPlanIncludedServices extends Model {
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

  SubscriptionPlanIncludedServices.init(
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
          model: "subscription_plan",
          key: "id",
        }
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        field: "display_order",
        allowNull: false
      },
      includedServiceName: {
        type: DataTypes.STRING,
        field: "included_service_name",
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
      modelName: "SubscriptionPlanIncludedServices",
      tableName: "subscription_plan_included_services ",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return SubscriptionPlanIncludedServices;
};

export default SubscriptionPlanIncludedServices;
