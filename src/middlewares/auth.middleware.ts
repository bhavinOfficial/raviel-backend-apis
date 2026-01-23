import { NextFunction, Request, Response } from "express";
import { ApiResponse, helper } from "../common/utils/index";
import db from "../models/index";
import { message, enums } from "../common/constants/index";

//* Interface for auth options parameters
export interface AuthOptions {
  isTokenRequired?: boolean;
  usersAllowed?: string[];
}

//* Interface for find user from database
export interface User {
  Role: {};
  id: string;
  email: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const auth = ({ isTokenRequired = true, usersAllowed = [] }: AuthOptions) => {
  return async (
    req: Request & { user?: { id: string; role: string; email: string } },
    res: Response,
    next: NextFunction
  ) => {
    //* get token from request header and remove Bearer from it
    // const token = (
    //   req.header("x-auth-token") || req.header("Authorization")
    // )?.replace(/Bearer +/g, "");

    const token = (
      req.cookies?.accessToken ||
      req.header("x-auth-token") ||
      req.header("Authorization")
    )?.replace(/Bearer +/g, "");

    //* check if token is required and token is present in the request header or not`
    // if (token === undefined)
    //   return ApiResponse.UNAUTHORIZED({
    //     res,
    //     message: "Access denied. No token provided.",
    //   });

    //* check if token is required and token is present in the request header or not
    if (isTokenRequired && !token)
      return ApiResponse.UNAUTHORIZED({
        res,
        message: "Access denied. No token provided.",
      });

    //* check if token is not required and token is present in the request header or not
    if (!isTokenRequired && !token) return next();

    //* decode token and get user details from it
    let decoded: any = await helper.decodeToken({ token });

    // * check if docoded token is valid or not
    if (!decoded)
      return ApiResponse.UNAUTHORIZED({
        res,
        message: "Access denied. Invalid token.",
      });

    //* check if token is valid or not
    if (decoded?.exp < Date.now() / 1000)
      return ApiResponse.UNAUTHORIZED({
        res,
        message: "Access denied. Token expired.",
      });

    //* check if user is present in the database or not
    let user: User = await db.User.findOne({
      where: { id: decoded.id },
      raw: true,
    });
    
    //* check if user is present in the database or not
    if (!user)
      return ApiResponse.UNAUTHORIZED({
    res,
    message: "Access denied. Invalid token.",
  });
  
  //* check if user is active or not
  if (!user.isActive)
    return ApiResponse.UNAUTHORIZED({
  res,
  message: "Access denied. User is not active.",
});

//* Make user object and assign user details to it
    req.user = user;
    // {
    //   id: user.id,
    //   role: user.role,
    //   email: user.email,
    // };

    // next();
    //* check if user is allowed to access the route or not

    // if (usersAllowed.length) {
    //   //? check if user is admin or not
    // if (req.user.role === enums.ROLE.ADMIN) return next();

    //   //? check if all are allowed to access the route or not
    if (usersAllowed.includes("*")) return next();

    //   //? check if perticuler role is allowed to access the route or not
    if (usersAllowed.includes(req.user.role)) return next();

    //   return ApiResponse.UNAUTHORIZED({ res, message: "Access denied. Invalid token." });
    // } else {
    //   //? check if user is admin or not
    //   if (req.user.role === "admin") return next();
    //   return ApiResponse.UNAUTHORIZED({ res, message: "Access denied. Invalid token." });
    // }
    return ApiResponse.UNAUTHORIZED({ res, message: "Access denied." });
  };
};

// const auth = ({ isTokenRequired = true, usersAllowed = [] }: AuthOptions = {}) => {
//   return async (req: any, res: Response, next: NextFunction) => {
//     const token: string = req.header("x-auth-token");
//     if (isTokenRequired && !token) return ApiResponse.BAD_REQUEST({ res, message: message.TOKEN_REQUIRED });
//     if (!isTokenRequired && !token) return next();

//     let user: User;

//       let decoded: any = await helper.decodeToken({ token });

//       user = await db.user.findOne({ _id: decoded._id, isActive: true }).populate("roleId").lean();
//       if (!user) return ApiResponse.UNAUTHORIZED({ res, message: message.INVALID_TOKEN });

//     req.user = {
//       _id: user._id,
//       role: user.roleId.name,
//     };

//     if (usersAllowed.length) {
//       if (req.user.role === enums.ROLE.ADMIN) return next();
//       if (usersAllowed.includes("*")) return next();
//       if (usersAllowed.includes(req.user.role)) return next();

//       return ApiResponse.UNAUTHORIZED({ res, message: message.UNAUTHORIZED });
//     } else {
//       if (req.user.role === enums.ROLE.ADMIN) return next();
//       return ApiResponse.UNAUTHORIZED({ res, message: message.UNAUTHORIZED });
//     }
//   };
// };

export default auth;
