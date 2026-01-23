import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";

const UserModel = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public role!: string;
    public phoneNumber!: string;
    public lastLoginDate!: Date | null;
    public isOnboardingCompleted!: boolean;
    public totalFixedPayment!: number;
    public totalNMVPayment!: number;
    public finalPayout!: number;
    public razorpayCustomerId!: string;
    public createdAt!: Date;
    public updatedAt!: Date | null;
    public isActive!: boolean;
    // toJSON() {
    //   let attributes = Object.assign({}, this.get());
    //   delete attributes.password_hash;
    //   return attributes;
    // }

    static associate(models: any) {
      //* define association here
        User.hasOne(models.UserBusinessDetails, {
          foreignKey: "userId",
          as: "userBusinessDetails",
        });
        User.hasMany(models.UserSubscriptions, {
          foreignKey: "userId",
          as: "userSubscriptions",
        });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        field: "first_name",
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        field: "last_name",
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(enums.ROLE)),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "phone_number"
      },
      lastLoginDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_login_date"
      },
      isOnboardingCompleted: {
        type: DataTypes.BOOLEAN,
        field: "is_onboarding_completed",
        defaultValue: false,
      },
      totalFixedPayment: {
        type: DataTypes.DECIMAL(10, 2),
        field: "total_fixed_payment",
        defaultValue: 0,
        allowNull: false
      },
      totalNMVPayment: {
        type: DataTypes.DECIMAL(10, 2),
        field: "total_nmv_payment",
        defaultValue: 0,
        allowNull: false
      },
      finalPayout: {
        type: DataTypes.DECIMAL(10, 2),
        field: "final_payout",
        defaultValue: 0,
        allowNull: false
      },
      razorpayCustomerId: {
        type: DataTypes.STRING,
        field: "razorpay_customer_id",
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active"
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
      modelName: "User",
      tableName: "users",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return User;
};

export default UserModel;
