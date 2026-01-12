import { Request } from "express";

export interface JwtToken {
  id: string;
  email: string;
  role?: string;
}
export interface AuthOptions {
  isTokenRequired?: boolean;
  usersAllowed?: string[];
}
export interface decoded {
  user: {
    _id: string;
    role: string;
  };
}
export interface sendEmailOptions {
  to: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
