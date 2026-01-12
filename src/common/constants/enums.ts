// TODO: Add all the enums here
const enums = {
  //? HTTP Status Codes
  HTTP_CODES: {
    BAD_REQUEST: 400,
    DUPLICATE_VALUE: 409,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    METHOD_NOT_ALLOWED: 405,
    MOVED_PERMANENTLY: 301,
    NOT_ACCEPTABLE: 406,
    NOT_FOUND: 404,
    NO_CONTENT_FOUND: 204,
    OK: 200,
    PERMANENT_REDIRECT: 308,
    UNAUTHORIZED: 401,
    UPGRADE_REQUIRED: 426,
    VALIDATION_ERROR: 422,
    CREATED: 201,
  },

  // ? Roles
  ROLE: {
    PARTNER: "partner",
    SELLER: "seller",
  },
  // ROLE: {
  //     ADMIN: "ROLE_ADMIN",
  //     USER: "ROLE_USER",
  //     EXTERNAL_USER: "ROLE_EXTERNAL_USER",
  //     OPERATIONS: "ROLE_OPERATIONS",
  //     MANAGEMENT: "ROLE_MANAGEMENT"
  // },

  // ? User scopes
  SCOPE: {
    LOGIN: "login",
    REGISTER: "register",
    VERIFY_OTP: "verify_otp",
    RESEND_OTP: "resend_otp",
    FORGOT_PASSWORD: "forgot_password",
    RESET_PASSWORD: "reset_password",
  },
};

export default enums;
