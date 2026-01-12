import { Response } from "express";
import { enums } from "../constants";

// TODO: Create all api response function
const ApiResponse = {
  //* Create api response function for bad request
  BAD_REQUEST: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json({
      success: false,
      status: enums.HTTP_CODES.BAD_REQUEST,
      message,
      payload,
    });
  },

  //* Create api response function for duplicate value
  DUPLICATE_VALUE: ({
    res,
    message,
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.DUPLICATE_VALUE).json({
      success: false,
      status: enums.HTTP_CODES.DUPLICATE_VALUE,
      message: message || "Duplicate value.",
      payload,
    });
  },

  //* Create api response function for forbidden
  FORBIDDEN: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.FORBIDDEN).json({
      success: false,
      status: enums.HTTP_CODES.FORBIDDEN,
      message,
      payload,
    });
  },

  //* Create api response function for internal server error
  CATCH_ERROR: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    let responseCode = enums.HTTP_CODES.INTERNAL_SERVER_ERROR;

    if (
      (message && message.includes("validation failed")) ||
      message.includes("duplicate key error collection")
    ) {
      responseCode = enums.HTTP_CODES.BAD_REQUEST;
    }

    res.status(responseCode).json({
      success: false,
      status: responseCode,
      message,
      payload,
    });
  },

  //* Create api response function for method not allowed
  NOT_ACCEPTABLE: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.NOT_ACCEPTABLE).json({
      success: false,
      status: enums.HTTP_CODES.NOT_ACCEPTABLE,
      message,
      payload,
    });
  },

  //* Create api response function for not found
  NOT_FOUND: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.NOT_FOUND).json({
      success: false,
      status: enums.HTTP_CODES.NOT_FOUND,
      message,
      payload,
    });
  },

  //* Create api response function for created
  CREATED: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.CREATED).json({
      success: true,
      status: enums.HTTP_CODES.CREATED,
      message,
      payload,
    });
  },

  //* Create api response function for success
  OK: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.OK).json({
      success: true,
      status: enums.HTTP_CODES.OK,
      message,
      payload,
    });
  },

  //* Create api response function for unauthorized
  UNAUTHORIZED: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.UNAUTHORIZED).json({
      success: false,
      status: enums.HTTP_CODES.UNAUTHORIZED,
      message,
      payload,
    });
  },

  //* Create api response function for validation error
  VALIDATION_ERROR: ({
    res,
    message = "-",
    payload = {},
  }: {
    res: Response;
    message?: string;
    payload?: any;
  }) => {
    res.status(enums.HTTP_CODES.VALIDATION_ERROR).json({
      success: false,
      status: enums.HTTP_CODES.VALIDATION_ERROR,
      message,
      payload,
    });
  },
};

export default ApiResponse;
