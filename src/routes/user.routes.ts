import express from "express";
import userController from "../controllers/user.controller";
import { enums } from "../common/constants";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

//? POST
/**
 * @openapi
 * /user/register:
 *    post:
 *      tags:
 *      - User
 *      summary: User-Registration
 *      description: This is the API for register user.
 *      operationId: User-Registration
 *      deprecated: false
 *      security: []
 *      parameters: []
 *      requestBody:
 *        description: 'Request body payload'
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *              - $ref: '#/components/schemas/User-Registration-Request'
 *              - example:
 *                  firstName: John
 *                  lastName: Doe
 *                  email: john.doe@example.com
 *                  role: partner
 *                  password: User@123
 *                  phoneNumber: "9999966666"
 *            example:
 *              firstName: John
 *              lastName: Doe
 *              email: john.doe@example.com
 *              role: partner
 *              password: User@123
 *              phoneNumber: "9999966666"
 *        required: true
 *      responses:
 *        201:
 *          description: Created
 *          headers: {}
 *          content:
 *            application/json; charset=utf-8:
 *              schema:
 *                allOf:
 *                - $ref: '#/components/schemas/User-Registration-Response'
 *                - example:
 *                    success: true
 *                    status: 201
 *                    message: User created successfully.
 *                    payload:
 *                      id: a9201deb-ca29-476f-99f8-2e740f4639ca
 *                      firstName: John
 *                      lastName: Doe
 *                      email: john.doe@example.com
 *                      phoneNumber: "9999966666"
 *                      isActive: true
 *                      lastLoginDate: null
 *                      createdAt: 2026-01-02T15:14:43.408Z
 *                      updatedAt: 2026-01-02T15:14:43.409Z
 * components:
 *   schemas:
 *    User-Registration-Request:
 *      required:
 *      title: User-Registration-Request
 *        - firstName
 *        - lastName
 *        - email
 *        - role
 *        - password
 *        - phoneNumber
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string
 *        role:
 *          type: string
 *        password:
 *          type: string
 *        phoneNumber:
 *          type: string
 *      example:
 *        firstName: John
 *        lastName: Doe
 *        email: john.doe@example.com
 *        role: partner
 *        password: User@123
 *        phoneNumber: "9999966666"
 *    User-Registration-Response:
 *      title: User-Registration-Response
 *      required:
 *      - success
 *      - status
 *      - message
 *      - payload
 *      type: object
 *      properties:
 *        success:
 *          type: boolean
 *        status:
 *          type: integer
 *          format: int32
 *        message:
 *          type: string
 *        payload:
 *          allOf:
 *          - $ref: '#/components/schemas/User-Registration-Response-Payload'
 *          - {}
 *      example:
 *        success: true
 *        status: 201
 *        message: User created successfully.
 *        payload:
 *          id: a9201deb-ca29-476f-99f8-2e740f4639ca
 *          firstName: John
 *          lastName: Doe
 *          email: john.doe@example.com
 *          phoneNumber: "9999966666"
 *          isActive: true
 *          lastLoginDate: null
 *          createdAt: 2026-01-02T15:14:43.408Z
 *          updatedAt: 2026-01-02T15:14:43.409Z
 *    User-Registration-Response-Payload:
 *      title: User-Registration-Response-Payload
 *      required:
 *      - id
 *      - firstName
 *      - lastName
 *      - email
 *      - phoneNumber
 *      - isActive
 *      - lastLoginDate
 *      - createdAt
 *      - updatedAt
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        email:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        isActive:
 *          type: boolean
 *        lastLoginDate:
 *          type: string
 *          nullable: true
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *          nullable: true
 *      example:
 *        id: a9201deb-ca29-476f-99f8-2e740f4639ca
 *        firstName: John
 *        lastName: Doe
 *        email: john.doe@example.com
 *        phoneNumber: "9999966666"
 *        isActive: true
 *        lastLoginDate: null
 *        createdAt: 2026-01-02T15:14:43.408Z
 *        updatedAt: 2026-01-02T15:14:43.409Z
 */
//* Register user API
router.post(
  "/register",
  auth({
    isTokenRequired: false,
    usersAllowed: [],
  }),
  userController.registerUser.validation,
  userController.registerUser.handler,
);

//? POST
/**
 * @openapi
 * /user/login:
 *    post:
 *      tags:
 *      - User
 *      summary: User-Login
 *      description: This is the API for user login.
 *      operationId: User-Login
 *      deprecated: false
 *      security: []
 *      parameters: []
 *      requestBody:
 *        description: 'Request body payload'
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: john.doe@example.com
 *                password:
 *                  type: string
 *                  example: User@123
 *              required:
 *                - email
 *                - password
 *        required: true
 *      responses:
 *        200:
 *          description: OK
 *          headers: {}
 *          content:
 *            application/json; charset=utf-8:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  status:
 *                    type: integer
 *                    format: int32
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: User logged in successfully.
 *                  payload:
 *                    type: object
 *                    properties:
 *                      accessToken:
 *                        type: string
 *                        example: "eyJhbGciOiJIUzI1NiIsInw5cCI6skpXVCJ9.eyJpZCI6IjIyM2ExYTZjLTY3NDUtNGFmMi05OWVkLWE3YjZlNDA1MTY2ZCIsImVtYWlsIjoiam9obi5kb2UxMkBleGFtcGxlLmNvbSIsInJvbGUiOiJwYXJ0bmVyIiwiaWF0IjoxNzY3ODQ1NTUyLCJleHAiOjE3Njg0NTAzNTJ9.UKoiGrKI0nkoYqLF5Vs9AP0tLxZB_OQPEE_MvS-2jrE"
 */
//* login user API
router.post(
  "/login",
  auth({
    isTokenRequired: false,
    usersAllowed: [],
  }),
  userController.loginUser.validation,
  userController.loginUser.handler,
);

//? PUT
/**
 * @openapi
 * /user:
 *    put:
 *      tags:
 *      - User
 *      summary: Update-User
 *      description: This is the API for update logged in user.
 *      operationId: User-Update
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters: []
 *      requestBody:
 *        description: 'Request body payload'
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  example: John1
 *                lastName:
 *                  type: string
 *                  example: Doe1
 *                phoneNumber:
 *                  type: string
 *                  example: 9977665544
 *                businessName:
 *                  type: string
 *                  example: Doe Manufacturing India Pvt Ltd
 *                gstNumber:
 *                  type: string
 *                  example: 27ABCDE1234F1Z5
 *                gstAddress:
 *                  type: string
 *                  example: Plot No. 45, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra - 400093
 *                manufacturerNumber:
 *                  type: string
 *                  example: MFG-IND-458921
 *                fullFillerNumber:
 *                  type: string
 *                  example: FUL-IND-774512
 *                pickupAddress:
 *                  type: string
 *                  example: Warehouse No. 12, Bhiwandi Logistics Park, Thane, Maharashtra - 421302
 *                businessType:
 *                  type: string
 *                  example: Manufacturer
 *                pancardNumber:
 *                  type: string
 *                  example: ABCDE1234F
 *                managerPhoneNumber:
 *                  type: string
 *                  example: "9995556663"
 *                managerEmail:
 *                  type: string
 *                  example: manager@gmail.com
 *        required: true
 *      responses:
 *        200:
 *          description: OK
 *          headers: {}
 *          content:
 *            application/json; charset=utf-8:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  status:
 *                    type: integer
 *                    format: int32
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: User Updated successfully.
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Update user API
router.put(
  "/",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER, enums.ROLE.SELLER],
  }),
  userController.updateUser.validation,
  userController.updateUser.handler,
);

//? GET
/**
 * @openapi
 * /user:
 *    get:
 *      tags:
 *      - User
 *      summary: Fetch-User
 *      description: This is the API for fetch logged in user.
 *      operationId: User-Fetch
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters: []
 *      requestBody: []
 *      responses:
 *        200:
 *          description: OK
 *          headers: {}
 *          content:
 *            application/json; charset=utf-8:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  status:
 *                    type: integer
 *                    format: int32
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: User details fetched successfully.
 *                  payload:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        example: "a9201deb-ca29-476f-99f8-2e740f4639ca"
 *                      firstName:
 *                        type: string
 *                        example: John
 *                      lastName:
 *                        type: string
 *                        example: Doe
 *                      email:
 *                        type: string
 *                        example: "john.doe@example.com"
 *                      role:
 *                        type: string
 *                        example: partner
 *                      isOnboardingCompleted:
 *                        type: boolean
 *                        example: true
 *                      totalFixedPayment:
 *                        type: number
 *                        example: 3000
 *                      totalNMVPayment:
 *                        type: number
 *                        example: 0
 *                      finalPayout:
 *                        type: number
 *                        example: 3000
 *                      razorpayCustomerId:
 *                        type: string
 *                        example: cust_S7GuWAOrpwOsJq
 *                      phoneNumber:
 *                        type: string
 *                        example: "9977665544"
 *                      isActive:
 *                        type: boolean
 *                        example: true
 *                      lastLoginDate:
 *                        type: string
 *                        nullable: true
 *                        example: null
 *                      createdAt:
 *                        type: string
 *                        example: 2026-01-02T15:14:43.408Z
 *                      updatedAt:
 *                        type: string
 *                        nullable: true
 *                        example: 2026-01-02T15:14:43.409Z
 *                      userBusinessDetails:
 *                        type: object
 *                        properties:
 *                            id:
 *                              type: string
 *                              example: 96ad270b-87f5-49b3-abed-a190ec46559d
 *                            userId:
 *                              type: string
 *                              example: a9201deb-ca29-476f-99f8-2e740f4639ca
 *                            businessName:
 *                              type: string
 *                              example: Doe Manufacturing India Pvt Ltd
 *                            gstNumber:
 *                              type: string
 *                              example: 27ABCDE1234F1Z5
 *                            gstAddress:
 *                              type: string
 *                              example: Plot No. 45, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra - 400093
 *                            manufacturerNumber:
 *                              type: string
 *                              example: MFG-IND-458921
 *                            fullFillerNumber:
 *                              type: string
 *                              example: FUL-IND-774512
 *                            pickupAddress:
 *                              type: string
 *                              example: Warehouse No. 12, Bhiwandi Logistics Park, Thane, Maharashtra - 421302
 *                            businessType:
 *                              type: string
 *                              example: Manufacturer
 *                            pancardNumber:
 *                              type: string
 *                              example: ABCDE1234F
 *                            managerPhoneNumber:
 *                              type: string
 *                              example: "9995556663"
 *                            managerEmail:
 *                              type: string
 *                              example: manager@gmail.com
 *                            createdAt:
 *                              type: string
 *                              example: 2026-01-15T17:10:47.201Z
 *                            updatedAt:
 *                              type: string
 *                              example: 2026-01-15T17:10:47.201Z
 *                      userSubscriptions:
 *                        type: object
 *                        properties:
 *                            id:
 *                              type: string
 *                              example: 96ad270b-87f5-49b3-abed-a190ec41529d
 *                            userId:
 *                              type: string
 *                              example: a9201deb-ca29-476f-99f8-2e740f4639ca
 *                            subscriptionPlanId:
 *                              type: string
 *                              example: a426f61e-ea09-4bea-9b87-163f766d6303
 *                            razorpaySubscriptionId:
 *                              type: string
 *                              example: sub_S7SrQkjwbyhFBW
 *                            razorpayPlanId:
 *                              type: string
 *                              example: plan_S7FPZXIdNebDx0
 *                            status:
 *                              type: string
 *                              example: active
 *                            currentPeriodStart:
 *                              type: string
 *                              example: 2026-01-23T21:14:26.000Z
 *                            currentPeriodEnd:
 *                              type: string
 *                              example: 2026-02-23T18:30:00.000Z
 *                            createdAt:
 *                              type: string
 *                              example: 2026-01-15T17:10:47.201Z
 *                            updatedAt:
 *                              type: string
 *                              example: 2026-01-15T17:10:47.201Z
 *                            subscriptionPlanDetails:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                    type: string
 *                                    example: 96ad270b-87f5-49b3-abed-a190e141519d
 *                                  planName:
 *                                    type: string
 *                                    example: Seller Special
 *                                  planDescription:
 *                                    type: string
 *                                    example: Basic tools to handle daily billing, inventory visibility, and bank settlements.
 *                                  planType:
 *                                    type: string
 *                                    example: monthly
 *                                  planTypeMonths:
 *                                    type: string
 *                                    example: 1
 *                                  isPopular:
 *                                    type: string
 *                                    example: false
 *                                  discountInPercentage:
 *                                    type: string
 *                                    example: 0
 *                                  price:
 *                                    type: number
 *                                    example: 1999
 *                                  displayOrder:
 *                                    type: number
 *                                    example: 1
 *                                  userType:
 *                                    type: string
 *                                    example: seller
 *                                  razorpayPlanId:
 *                                    type: string
 *                                    example: plan_S7FPZXIdNebDx0
 *                                  createdAt:
 *                                    type: string
 *                                    example: 2026-01-15T17:10:47.201Z
 *                                  updatedAt:
 *                                    type: string
 *                                    example: 2026-01-15T17:10:47.201Z
 *                      totalOrders:
 *                        type: number
 *                        example: 3
 *                      totalGMV:
 *                        type: number
 *                        example: 1995
 *                      pendingAcceptance:
 *                        type: number
 *                        example: 1
 *                      myPayment:
 *                        type: number
 *                        example: 85500
 *                      problematicOrder:
 *                        type: number
 *                        example: 0
 *                      cancelledBySellers:
 *                        type: number
 *                        example: 3
 *                      highReturn:
 *                        type: number
 *                        example: 3
 *                      InactiveSellers:
 *                        type: number
 *                        example: 0
 *                      returnOrders:
 *                        type: number
 *                        example: 1
 *                      returnOrderPercentage:
 *                        type: number
 *                        example: 33.33333333333333
 */
//* Fetch logged in User API
router.get(
  "/",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER, enums.ROLE.SELLER],
  }),
  userController.getLoggedInUserDetails.validation,
  userController.getLoggedInUserDetails.handler,
);

export default router;
