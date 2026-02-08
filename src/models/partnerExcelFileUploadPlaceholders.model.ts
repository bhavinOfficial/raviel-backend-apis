import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const partnerExcelFileUploadPlaceholders = (
  sequelize: Sequelize,
  DataTypes: any,
) => {
  class partnerExcelFileUploadPlaceholders extends Model {
    public id!: string;
    public partnerId!: string;
    public fileType!: string;
    public expectedDate!: string;
    public status!: string;
    public uploadedAt!: string;
    public fileName!: string;
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

  partnerExcelFileUploadPlaceholders.init(
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
      fileType: {
        type: DataTypes.ENUM("daily", "weekly", "monthly"),
        field: "file_type",
        allowNull: false,
      },
      expectedDate: {
        type: DataTypes.DATEONLY,
        field: "expected_date",
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("missed", "pending", "uploaded"),
        field: "status",
        allowNull: true,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        field: "uploaded_at",
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING,
        field: "file_name",
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
      modelName: "PartnerExcelFileUploadPlaceholders",
      tableName: "partner_excel_file_upload_placeholders",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );
  return partnerExcelFileUploadPlaceholders;
};

export default partnerExcelFileUploadPlaceholders;
