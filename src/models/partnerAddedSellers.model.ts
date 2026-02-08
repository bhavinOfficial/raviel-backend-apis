import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";
import { alternatives } from "joi";
type UUID = string & { readonly __brand: unique symbol };

const PartnerAddedSellers = (sequelize: Sequelize, DataTypes: any) => {
  class PartnerAddedSellers extends Model {
    public id!: UUID;
    public partnerId!: UUID;
    public sellerId!: string; // vendor id
    public sellerName!: string; // account holder name
    public launchingDate!: string;
    public listingDate!: string;
    public sellerEmailId!: string;
    public phoneNumber!: string;
    public password!: string;
    public brandApproval!: string;
    public gstNumber!: string;
    public trademarkClass!: string;
    public dominantL1AtLaunch!: string;
    public SKUsAtLaunch!: number;
    public currentSKUsLive!: number;
    public productCategories!: string[];
    public sellerStatus!: string;
    public fixedPaymentAmount!: number;
    public fixedPaymentMonthYear!: string;
    public fixedPaymentReceivedOrNot!: boolean;
    public NMVPaymentAmount!: number;
    public NMVPaymentMonthYear!: string;
    public NMVPaymentReceivedOrNot!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    static associate(models: any) {
      //* define association here
      PartnerAddedSellers.hasMany(models.PartnerSellersOrders, {
        foreignKey: "sellerrId",
        sourceKey: "id",
        as: "sellerOrders",
      });
    }
  }

  PartnerAddedSellers.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      partnerId: {
        type: DataTypes.UUID,
        field: "partner_id",
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      sellerId: {
        type: DataTypes.STRING,
        field: "seller_id",
        allowNull: false,
        unique: true,
      },
      sellerName: {
        type: DataTypes.STRING,
        field: "seller_name",
        allowNull: false,
      },
      launchingDate: {
        type: DataTypes.DATEONLY,
        field: "launching_date",
        allowNull: false,
      },
      listingDate: {
        type: DataTypes.DATEONLY,
        field: "listing_date",
        allowNull: true,
      },
      sellerEmailId: {
        type: DataTypes.STRING,
        field: "seller_email_id",
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        field: "phone_number",
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
        allowNull: true,
      },
      brandApproval: {
        type: DataTypes.ENUM("pending", "approved"),
        field: "brand_approval",
        allowNull: true,
      },
      gstNumber: {
        type: DataTypes.STRING,
        field: "gst_number",
        allowNull: true,
      },
      trademarkClass: {
        type: DataTypes.ENUM("pending", "approved"),
        field: "trademark_class",
        allowNull: true,
      },
      dominantL1AtLaunch: {
        type: DataTypes.STRING,
        field: "dominant_L1_at_launch",
        allowNull: true,
      },
      SKUsAtLaunch: {
        type: DataTypes.INTEGER,
        field: "SKUs_at_launch",
        defaultValue: 0,
      },
      currentSKUsLive: {
        type: DataTypes.INTEGER,
        field: "current_SKUs_live",
        defaultValue: 0,
      },
      productCategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
        field: "product_categories",
      },
      sellerStatus: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: true,
        field: "seller_status",
      },
      fixedPaymentAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        field: "fixed_payment_amount",
      },
      fixedPaymentMonthYear: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fixed_payment_month_year",
      },
      fixedPaymentReceivedOrNot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "fixed_payment_received_or_not",
      },
      NMVPaymentAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        field: "nmv_payment_amount",
      },
      NMVPaymentMonthYear: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "nmv_payment_month_year",
      },
      NMVPaymentReceivedOrNot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "nmv_payment_received_or_not",
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
      modelName: "PartnerAddedSellers",
      tableName: "partner_added_sellers",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return PartnerAddedSellers;
};

export default PartnerAddedSellers;
