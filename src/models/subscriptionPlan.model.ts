import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const SubscriptionPlan = (sequelize: Sequelize, DataTypes: any) => {
  class SubscriptionPlan extends Model {
    public id!: string;
    public userId!: string;
    public businessName!: string;
    public gstNumber!: string;
    public gstAddress!: string;
    public manufacturerNumber!: string;
    public fullFillerNumber!: string;
    public pickupAddress!: string;
    public businessType!: string;
    public pancardNumber!: string;
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

  SubscriptionPlan.init(
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
      gstNumber: {
        type: DataTypes.STRING,
        unique: true,
        field: "gst_number",
      },
      gstAddress: {
        type: DataTypes.STRING,
        unique: true,
        field: "gst_address",
      },
      manufacturerNumber: {
        type: DataTypes.STRING,
        field: "manufacturer_number",
      },
      fullFillerNumber: {
        type: DataTypes.STRING,
        field: "full_filler_number",
      },
      pickupAddress: {
        type: DataTypes.STRING,
        field: "pickup_address",
      },
      businessType: {
        type: DataTypes.STRING,
        field: "business_type",
      },
      pancardNumber: {
        type: DataTypes.STRING,
        field: "pancard_number",
        unique: true,
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
      modelName: "SubscriptionPlan",
      tableName: "subscription_plan",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return SubscriptionPlan;
};

export default SubscriptionPlan;
