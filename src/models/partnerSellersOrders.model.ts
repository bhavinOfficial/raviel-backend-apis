import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";
import db from "../models/index";
type UUID = string & { readonly __brand: unique symbol };

const PartnerSellersOrders = (sequelize: Sequelize, DataTypes: any) => {
  class PartnerSellersOrders extends Model {
    public id!: UUID;
    public sellerrId!: UUID;
    public orderCreatedDate!: string;
    public orderId!: string;
    public shipmentId!: string;
    public shipmentStatus!: string;
    public orderValue!: string;
    public deliveryPartner!: string;
    public modeOfPayment!: string;
    public orderShipped!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    static associate(models: any) {
      //* define association here
      PartnerSellersOrders.belongsTo(models.PartnerAddedSellers, {
        foreignKey: "sellerrId",
        as: "sellerDetails",
      });
    }
  }

  PartnerSellersOrders.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sellerrId: {
        type: DataTypes.UUID,
        field: "sellerr_id",
        allowNull: false,
        references: {
          model: "partner_added_sellers",
          key: "id",
        },
      },
      orderCreatedDate: {
        type: DataTypes.DATEONLY,
        field: "order_created_date",
        allowNull: true,
      },
      orderId: {
        type: DataTypes.STRING,
        field: "order_id",
        allowNull: false,
      },
      shipmentId: {
        type: DataTypes.STRING,
        field: "shipment_id",
        allowNull: true,
      },
      shipmentStatus: {
        type: DataTypes.ENUM(
          "DELIVERED",
          "CUSTOMER CANCELLED",
          "CANCELLED",
          "SELLER CANCELLED",
          "RETURNED",
          "REFUNDED",
          "RTO INITIATED",
          "RTO IN TRANSIT",
          "RTO COMPLETED",
          "PLACED",
          "SELLER PROCESSING",
          "BAG_PICKED",
          "BAG_PACKED",
          "DP_ASSIGNED",
          "OUT_FOR_PICKUP",
          "IN TRANSIT",
          "OUT FOR DELIVERY",
          "DELIVERY ATTEMPTED",
          "EDD_UPDATED",
          "BAG_PICK_FAILED",
          "REJECTED_BY_CUSTOMER",
          "BAG_LOST",
        ),
        field: "shipment_status",
        allowNull: true,
      },
      orderValue: {
        type: DataTypes.DECIMAL(10, 2),
        field: "order_value",
        allowNull: false,
      },
      deliveryPartner: {
        type: DataTypes.ENUM(
          "xpressbees_jio",
          "delhivery_jio",
          "shadowfax_jio",
          "",
        ),
        field: "delivery_partner",
        allowNull: true,
      },
      modeOfPayment: {
        type: DataTypes.ENUM("COD", "PREPAID"),
        field: "mode_of_payment",
        allowNull: true,
      },
      orderShipped: {
        type: DataTypes.BOOLEAN,
        field: "order_shipped",
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
      modelName: "PartnerSellersOrders",
      tableName: "partner_sellers_orders",
      freezeTableName: true,
      underscored: true,
      timestamps: true,

      indexes: [
        {
          unique: true,
          name: "uniq_order",
          fields: ["sellerr_id", "order_id", "shipment_id"],
        },
      ],
    },
  );
  return PartnerSellersOrders;
};

export default PartnerSellersOrders;
