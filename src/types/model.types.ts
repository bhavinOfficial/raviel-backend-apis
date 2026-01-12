import { ObjectId } from "mongoose";

export interface OtpModel {
  _id: ObjectId;
  otp: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleModel {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UserModel {
  _id: ObjectId;
  userName: string;
  email: string;
  mobile: string;
  password: string;
  roleId: ObjectId;
  isActive: boolean;
}
