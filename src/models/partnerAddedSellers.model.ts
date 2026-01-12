import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";
type UUID = string & { readonly __brand: unique symbol };

const PartnerAddedSellers = (sequelize: Sequelize, DataTypes: any) => {
  class PartnerAddedSellers extends Model {
    public id!: UUID;
    public partnerId!: UUID;
    public sellerId!: string;
    public sellerName!: string;
    public launchingDate!: string;
    public sellerEmailId!: string;
    public gstNumber!: string;
    public gstAddress!: string;
    public pancardNumber!: string;
    public signatureImageURL!: string;
    public bankAccountNumber!: string;
    public bankIFSCCode!: string;
    public bankAccountHolderFullName!: string;
    public bankAccountType!: string;
    public createdAt!: Date;
    public updatedAt!: Date | null;

    static associate(models: any) {
      //* define association here
      //   User.belongsTo(models.Role, {
      //     foreignKey: "role_id",
      //     as: "role",
      //   });
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
        }
      },
      sellerId: {
        type: DataTypes.STRING,
        field: "seller_id",
        allowNull: false,
        unique: true,
      },
      sellerName: {
        type: DataTypes.STRING,
        unique: true,
        field: "seller_name",
        allowNull: false,
      },
      launchingDate: {
        type: DataTypes.DATE,
        field: "launching_date",
        allowNull: false,
      },
      sellerEmailId: {
        type: DataTypes.STRING,
        field: "seller_email_id",
        allowNull: false,
        unique: true
      },
      gstNumber: {
        type: DataTypes.STRING,
        unique: true,
        field: "gst_number",
        allowNull: false
      },
      gstAddress: {
        type: DataTypes.STRING,
        unique: true,
        field: "gst_address",
        allowNull: false
      },
      pancardNumber: {
        type: DataTypes.STRING,
        field: "pancard_number",
        unique: true,
        allowNull: false
      },
      signatureImageURL: {
        type: DataTypes.STRING,
        field: "signature_image_url",
        allowNull: false
      },
      bankAccountNumber: {
        type: DataTypes.STRING,
        field: "bank_account_number",
        allowNull: false
      },
      bankIFSCCode: {
        type: DataTypes.STRING,
        field: "bankIFSCCode",
        allowNull: false
      },
      bankAccountHolderFullName: {
        type: DataTypes.STRING,
        field: "bank_account_holder_full_name",
        allowNull: false
      },
      bankAccountType: {
        type: DataTypes.ENUM("savings", "current"),
        field: "bank_account_type",
        allowNull: false
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
    }
  );
  return PartnerAddedSellers;
};

export default PartnerAddedSellers;
