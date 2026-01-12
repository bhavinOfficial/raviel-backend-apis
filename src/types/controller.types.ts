import { ObjectId } from "mongoose";

export interface Role {
  _id: ObjectId;
  name: string;
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: ObjectId;
  userName: string;
  email: string;
  mobile: string;
  password: string;
  roleId: {
    _id: ObjectId;
    name: string;
  };
  role: string;
  isActive: boolean;
}

export interface FetchUser {
  page?: number;
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: number;
  search?: string;
  [key: string]: any;
}
