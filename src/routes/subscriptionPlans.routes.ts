import express from "express";
import userBusinessDetailsController from "../controllers/userBusinessDetails.controller";
import { enums } from "../common/constants";
import auth from "../middlewares/auth.middleware";
import subscriptionPlansController from "../controllers/subscriptionPlans.controller";
const router = express.Router();

//? GET
/**
 * @openapi
 * /subscription-plans:
 *    get:
 *      tags:
 *      - Subscription-Plans
 *      summary: Fetch-Subscription-Plans
 *      description: This is the API for fetch subscription plans.
 *      operationId: Create-User-Business-Details
 *      deprecated: false
 *      security: []
 *      parameters:
 *        - name: userType
 *          in: query
 *          schema: 
 *            type: string
 *            example: "partner"
 *            enum: [partner, seller, all]
 *        - name: planType
 *          in: query
 *          schema: 
 *            type: string
 *            example: "monthly"
 *            enum: [monthly, quarterly, half-yearly, yearly]
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
 *                    example: Subscription plans fetched successfully.
 *                  payload:
 *                    type: object
 *                    properties:
 *                      partner:
 *                        type: array
 *                        items: 
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              example: 83e44d9e-3e2b-4293-b21b-785d396ac01a
 *                            planName:
 *                              type: string
 *                              example: Seller Essentials
 *                            planDescription:
 *                              type: string
 *                              example: Smart tools for beginners to start selling fast
 *                            planType:
 *                              type: string
 *                              example: monthly
 *                            planTypeMonths:
 *                              type: string
 *                              example: 1
 *                            isPopular:
 *                              type: string
 *                              example: false
 *                            discountInPercentage:
 *                              type: string
 *                              example: 0
 *                            price:
 *                              type: string
 *                              example: 2999
 *                            displayOrder:
 *                              type: string
 *                              example: 1
 *                            userType:
 *                              type: string
 *                              example: partner
 *                            createdAt:
 *                              type: string
 *                              example: 2026-01-16T04:30:00.000Z
 *                            updatedAt:
 *                              type: string
 *                              example: 2026-01-16T04:30:00.000Z
 */
//* Fetch subscriptionplans API
router.get(
  "/",
  auth({
    isTokenRequired: false,
    usersAllowed: [],
  }),
  subscriptionPlansController.fetchSubscriptionPlans.validation,
  subscriptionPlansController.fetchSubscriptionPlans.handler
);

export default router;
