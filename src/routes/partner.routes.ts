import express from "express";
import partnerController from "../controllers/partner.controller";
import { enums } from "../common/constants";
import auth from "../middlewares/auth.middleware";
import uploadExcel from "../middlewares/uploadExcel.middleware";
const router = express.Router();

//? POST
/**
 * @openapi
 * /partner/add-seller:
 *    post:
 *      tags:
 *      - Partner
 *      summary: Add-seller-using-form
 *      description: This is the API for adding seller by partner using form.
 *      operationId: Add-seller-using-form
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
 *                sellerId:
 *                  type: string
 *                  example: D77EE7
 *                sellerName:
 *                  type: string
 *                  example: John Doe
 *                brandName:
 *                  type: string
 *                  example: Jd evergreen
 *                launchingDate:
 *                  type: string
 *                  example: 2025-06-14
 *                listingDate:
 *                  type: string
 *                  example: 2025-08-16
 *                sellerEmailId:
 *                  type: string
 *                  example: "john@example.com"
 *                phoneNumber:
 *                  type: string
 *                  example: 9998886667
 *                password:
 *                  type: string
 *                  example: User@123
 *                brandApproval:
 *                  type: string
 *                  example: pending
 *                gstNumber:
 *                  type: string
 *                  example: 29AAACR5055K1Z6
 *                trademarkClass:
 *                  type: string
 *                  example: pending
 *                productCategories:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["electronics", "clothing"]
 *        required: true
 *      responses:
 *        201:
 *          description: Created
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
 *                    example: 201
 *                  message:
 *                    type: string
 *                    example: Seller added by partner successfully
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* partner add seller by form API
router.post(
  "/add-seller",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.partnerAddSellersViaForm.validation,
  partnerController.partnerAddSellersViaForm.handler,
);

//? put
/**
 * @openapi
 * /partner/update-seller/{sellerId}:
 *    put:
 *      tags:
 *      - Partner
 *      summary: Update-seller-added-by-partner
 *      description: This is the API for updating seller by partner.
 *      operationId: Update-seller-added-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: path
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *          required: true
 *      requestBody:
 *        description: 'Request body payload'
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                sellerName:
 *                  type: string
 *                  example: John Doe
 *                brandName:
 *                  type: string
 *                  example: Jd evergreen
 *                launchingDate:
 *                  type: string
 *                  example: 2025-06-14
 *                listingDate:
 *                  type: string
 *                  example: 2025-08-16
 *                sellerEmailId:
 *                  type: string
 *                  example: "john@example.com"
 *                phoneNumber:
 *                  type: string
 *                  example: 9998886667
 *                password:
 *                  type: string
 *                  example: User@123
 *                brandApproval:
 *                  type: string
 *                  example: pending
 *                gstNumber:
 *                  type: string
 *                  example: 29AAACR5055K1Z6
 *                dominantL1AtLaunch:
 *                  type: string
 *                  example: Fashion
 *                SKUsAtLaunch:
 *                  type: number
 *                  example: 10
 *                currentSKUsLive:
 *                  type: number
 *                  example: 70
 *                trademarkClass:
 *                  type: string
 *                  example: pending
 *                productCategories:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["electronics", "clothing"]
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
 *                    example: Seller updated successfully
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Seller update by partner API
router.put(
  "/update-seller/:sellerId",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.updateSellerAddedByPartner.validation,
  partnerController.updateSellerAddedByPartner.handler,
);

//? delete
/**
 * @openapi
 * /partner/delete-seller/{sellerId}:
 *    delete:
 *      tags:
 *      - Partner
 *      summary: delete-seller-added-by-partner
 *      description: This is the API for deleting seller by partner.
 *      operationId: delete-seller-added-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: path
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *          required: true
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
 *                    example: Seller deleted successfully
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Seller delete by partner API
router.delete(
  "/delete-seller/:sellerId",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.deleteSellerAddedByPartner.validation,
  partnerController.deleteSellerAddedByPartner.handler,
);

//? get
/**
 * @openapi
 * /partner/fetch-all-sellers:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-all-sellers-added-by-partner
 *      description: This is the API for fetching all the sellers added by partner.
 *      operationId: fetch-all-sellers-added-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: query
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *        - name: sellerStatus
 *          in: query
 *          schema:
 *            type: string
 *            enum: [active, inactive]
 *            example: active
 *        - name: sellerName
 *          in: query
 *          schema:
 *            type: string
 *          example: JD Evergreen
 *        - name: paymentByMonthYear
 *          in: query
 *          schema:
 *            type: string
 *          example: 2025-05-01
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
 *                    example: All sellers fetched successfully
 *                  payload:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: "fde54329-dead-4f73-a286-5f9882ac7e85"
 *                        partnerId:
 *                          type: string
 *                          example: ca8d6719-b0df-4bde-a12f-5950517a9fba
 *                        sellerId:
 *                          type: string
 *                          example: D77EE1
 *                        sellerName:
 *                          type: string
 *                          example: John Doe
 *                        brandName:
 *                          type: string
 *                          example: Jd evergreen
 *                        launchingDate:
 *                          type: string
 *                          example: 2025-06-14
 *                        listingDate:
 *                          type: string
 *                          example: 2025-08-16
 *                        sellerEmailId:
 *                          type: string
 *                          example: "john@example.com"
 *                        phoneNumber:
 *                          type: string
 *                          example: "9998886667"
 *                        password:
 *                          type: string
 *                          example: U2FsdGVkX1+xNDzASzT7dfWWoziZwb4rCeCB61dCg5w=
 *                        brandApproval:
 *                          type: string
 *                          example: pending
 *                        gstNumber:
 *                          type: string
 *                          example: "29AAACR5055K1Z6"
 *                        trademarkClass:
 *                          type: string
 *                          example: pending
 *                        dominantL1AtLaunch:
 *                          type: string
 *                          example: Fashion
 *                        SKUsAtLaunch:
 *                          type: number
 *                          example: 20
 *                        currentSKUsLive:
 *                          type: number
 *                          example: 80
 *                        productCategories:
 *                          type: array
 *                          items:
 *                            type: string
 *                          example: ["electronics", "clothing"]
 *                        sellerStatus:
 *                          type: string
 *                          example: active
 *                        fixedPaymentAmount:
 *                          type: number
 *                          example: 2000
 *                        fixedPaymentMonthYear:
 *                          type: string
 *                          example: "2025-05-01"
 *                        fixedPaymentReceivedOrNot:
 *                          type: boolean
 *                          example: true
 *                        NMVPaymentAmount:
 *                          type: number
 *                          example: 30000
 *                        NMVPaymentMonthYear:
 *                          type: string
 *                          example: "2025-07-01"
 *                        NMVPaymentReceivedOrNot:
 *                          type: boolean
 *                          example: true
 *                        totalOrders:
 *                          type: number
 *                          example: 580
 *                        totalReturnedTypeOrders:
 *                          type: number
 *                          example: 110
 *                        deliveredOrders:
 *                          type: number
 *                          example: 10
 *                        customerCancelledOrders:
 *                          type: number
 *                          example: 12
 *                        cancelledOrders:
 *                          type: number
 *                          example: 14
 *                        sellerCancelledOrders:
 *                          type: number
 *                          example: 16
 *                        returnedOrders:
 *                          type: number
 *                          example: 18
 *                        refundedOrders:
 *                          type: number
 *                          example: 20
 *                        rtoInitiatedOrders:
 *                          type: number
 *                          example: 22
 *                        rtoInTransitOrders:
 *                          type: number
 *                          example: 24
 *                        rtoCompletedOrders:
 *                          type: number
 *                          example: 26
 *                        placedOrders:
 *                          type: number
 *                          example: 28
 *                        sellerProcessingOrders:
 *                          type: number
 *                          example: 30
 *                        bagPickedOrders:
 *                          type: number
 *                          example: 32
 *                        bagPackedOrders:
 *                          type: number
 *                          example: 67
 *                        dpAssignedOrders:
 *                          type: number
 *                          example: 34
 *                        outForPickupOrders:
 *                          type: number
 *                          example: 36
 *                        inTransitOrders:
 *                          type: number
 *                          example: 38
 *                        outForDeliveryOrders:
 *                          type: number
 *                          example: 40
 *                        deliveryAttemptedOrders:
 *                          type: number
 *                          example: 42
 *                        bagPickFailedOrders:
 *                          type: number
 *                          example: 44
 *                        rejectedByCustomerOrders:
 *                          type: number
 *                          example: 46
 *                        bagLostOrders:
 *                          type: number
 *                          example: 48
 *                        totalGMV:
 *                          type: number
 *                          example: 384995
 *                        returnedOrderPercentage:
 *                          type: number
 *                          example: 35
 *                        cancelledOrderPercentage:
 *                          type: number
 *                          example: 20
 *                        CODOrdersPercentage:
 *                          type: number
 *                          example: 40
 *                        prepaidOrdersPercentage:
 *                          type: number
 *                          example: 60
 *                        totalPayout:
 *                          type: number
 *                          example: 32000
 *                        createdAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.448Z"
 *                        updatedAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.458Z"
 */
//* All sellers fetch by partner API
router.get(
  "/fetch-all-sellers",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchAllSellersAddedByPartner.validation,
  partnerController.fetchAllSellersAddedByPartner.handler,
);

//? get
/**
 * @openapi
 * /partner/cancelled-or-high-returned-by-sellers:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-cancelled-or-high-returned-sellers-by-partner
 *      description: This is the API for fetching cancelled or high returned sellers by partner.
 *      operationId: fetch-cancelled-or-high-returned-sellers-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: cancelledBySellers
 *          in: query
 *          schema:
 *            type: boolean
 *            enum: [true, false]
 *            example: true
 *        - name: highReturnsSellers
 *          in: query
 *          schema:
 *            type: boolean
 *            enum: [true, false]
 *            example: false
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
 *                    example: (Cancelled By|High returns) sellers fetched successfully
 *                  payload:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: "fde54329-dead-4f73-a286-5f9882ac7e85"
 *                        partnerId:
 *                          type: string
 *                          example: ca8d6719-b0df-4bde-a12f-5950517a9fba
 *                        sellerId:
 *                          type: string
 *                          example: D77EE1
 *                        sellerName:
 *                          type: string
 *                          example: John Doe
 *                        brandName:
 *                          type: string
 *                          example: Jd evergreen
 *                        launchingDate:
 *                          type: string
 *                          example: 2025-06-14
 *                        listingDate:
 *                          type: string
 *                          example: 2025-08-16
 *                        sellerEmailId:
 *                          type: string
 *                          example: "john@example.com"
 *                        phoneNumber:
 *                          type: string
 *                          example: "9998886667"
 *                        password:
 *                          type: string
 *                          example: U2FsdGVkX1+xNDzASzT7dfWWoziZwb4rCeCB61dCg5w=
 *                        brandApproval:
 *                          type: string
 *                          example: pending
 *                        gstNumber:
 *                          type: string
 *                          example: "29AAACR5055K1Z6"
 *                        trademarkClass:
 *                          type: string
 *                          example: pending
 *                        dominantL1AtLaunch:
 *                          type: string
 *                          example: Fashion
 *                        SKUsAtLaunch:
 *                          type: number
 *                          example: 20
 *                        currentSKUsLive:
 *                          type: number
 *                          example: 80
 *                        productCategories:
 *                          type: array
 *                          items:
 *                            type: string
 *                          example: ["electronics", "clothing"]
 *                        sellerStatus:
 *                          type: string
 *                          example: active
 *                        fixedPaymentAmount:
 *                          type: number
 *                          example: 2000
 *                        fixedPaymentMonthYear:
 *                          type: string
 *                          example: "2025-05-01"
 *                        fixedPaymentReceivedOrNot:
 *                          type: boolean
 *                          example: true
 *                        NMVPaymentAmount:
 *                          type: number
 *                          example: 30000
 *                        NMVPaymentMonthYear:
 *                          type: string
 *                          example: "2025-07-01"
 *                        NMVPaymentReceivedOrNot:
 *                          type: boolean
 *                          example: true
 *                        createdAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.448Z"
 *                        updatedAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.458Z"
 */
//* Cancelled or high returned sellers fetch by partner API
router.get(
  "/cancelled-or-high-returned-by-sellers",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchCancelledOrHighReturnsSellersByPartner.validation,
  partnerController.fetchCancelledOrHighReturnsSellersByPartner.handler,
);

//? get
/**
 * @openapi
 * /partner/fetch-all-orders:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-all-sellers-orders-added-by-partner
 *      description: This is the API for fetching all the seller's orders added by partner.
 *      operationId: fetch-all-sellers-orders-added-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: query
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *        - name: orderStatus
 *          in: query
 *          schema:
 *            type: string
 *            enum: ["DELIVERED", "CUSTOMER CANCELLED", "CANCELLED", "SELLER CANCELLED", "RETURNED", "REFUNDED", "RTO INITIATED", "RTO IN TRANSIT", "RTO COMPLETED", "PLACED", "SELLER PROCESSING", "BAG_PICKED", "BAG_PACKED",  "DP_ASSIGNED", "OUT_FOR_PICKUP", "IN TRANSIT", "OUT FOR DELIVERY", "DELIVERY ATTEMPTED", "EDD_UPDATED", "BAG_PICK_FAILED", "REJECTED_BY_CUSTOMER", "BAG_LOST"]
 *          example: DELIVERED
 *        - name: orderId
 *          in: query
 *          schema:
 *            type: string
 *          example: 1feea7a2-83ad-4ff1-9146-f971fbcf5b8e
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
 *                    example: All orders fetched successfully
 *                  payload:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: "fde54329-dead-4f73-a286-5f9882ac7e85"
 *                        sellerrId:
 *                          type: string
 *                          example: ER77R9
 *                        orderCreatedDate:
 *                          type: string
 *                          example: "2025-06-07"
 *                        orderId:
 *                          type: string
 *                          example: 17613677800912037A
 *                        shipmentId:
 *                          type: string
 *                          example: 17616678258431218295J
 *                        shipmentStatus:
 *                          type: string
 *                          example: DELIVERED
 *                        orderValue:
 *                          type: number
 *                          example: 699
 *                        deliveryPartner:
 *                          type: string
 *                          example: delhivery_jio
 *                        modeOfPayment:
 *                          type: string
 *                          example: COD
 *                        orderShipped:
 *                          type: boolean
 *                          example: true
 *                        createdAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.448Z"
 *                        updatedAt:
 *                          type: string
 *                          example: "2026-01-13T19:42:57.458Z"
 */
//* All orders fetch by partner API
router.get(
  "/fetch-all-orders",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchAllOrdersByPartner.validation,
  partnerController.fetchAllOrdersByPartner.handler,
);

//? get
/**
 * @openapi
 * /partner/seller/{sellerId}/orders/growth:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-sellers-order-growth-by-partner
 *      description: This is the API for fetching seller's growth by orders graph by partner.
 *      operationId: fetch-sellers-order-growth-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: path
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *        - name: timeTenure
 *          in: query
 *          schema:
 *            type: string
 *          example: daily
 *          enum: [daily, weekly, annually]
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
 *                    example: Seller's order growth fetched successfully
 *                  payload:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        label:
 *                          type: string
 *                          example: "2026-01-21"
 *                        orders:
 *                          type: string
 *                          example: 20
 *                        value:
 *                          type: string
 *                          example: "200"
 */
//* Fetch seller's growth by orders graph by partners API
router.get(
  "/seller/:sellerId/orders/growth",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchSellersOrderGrowthByPartner.validation,
  partnerController.fetchSellersOrderGrowthByPartner.handler,
);

//? get
/**
 * @openapi
 * /partner/top-performer-sellers:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-top-performer-sellers-by-partner
 *      description: This is the API for fetching top performer sellers by partner.
 *      operationId: fetch-top-performer-sellers-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerCount
 *          in: query
 *          schema:
 *            type: number
 *          example: 5
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
 *                    example: Top performer sellers fetched successfully
 *                  payload:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          example: 889ae87f-64dc-431b-97f7-c304f795702a
 *                        sellerId:
 *                          type: string
 *                          example: Q1BIK9
 *                        sellerName:
 *                          type: string
 *                          example: DOE ENTERPRIZE
 *                        totalOrder:
 *                          type: number
 *                          example: 50
 *                        GMV:
 *                          type: number
 *                          example: 15698
 */
//* Fetch top performer sellers by partners API
router.get(
  "/top-performer-sellers",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchTopPerformerSellers.validation,
  partnerController.fetchTopPerformerSellers.handler,
);

//? get
/**
 * @openapi
 * /partner/sales-report:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-sales-report-of-sellers-orders-by-partner
 *      description: This is the API for fetching sales report of sellers orders by partner.
 *      operationId: fetch-sales-report-of-sellers-orders-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: timeTenure
 *          in: query
 *          schema:
 *            type: string
 *          example: daily
 *          enum: [daily, weekly, annually]
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
 *                    example: Sales report fetched successfully
 *                  payload:
 *                    type: object
 *                    properties:
 *                      labels:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example:
 *                          - Thu
 *                          - Fri
 *                          - Sat
 *                          - Sun
 *                          - Mon
 *                          - Tue
 *                          - Wed
 *                      Delivered:
 *                        type: array
 *                        items:
 *                          type: number
 *                        example:
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 1499
 *                      Return:
 *                        type: array
 *                        items:
 *                          type: number
 *                        example:
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 30
 *                      Cancel:
 *                        type: array
 *                        items:
 *                          type: number
 *                        example:
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                      Movement:
 *                        type: array
 *                        items:
 *                          type: number
 *                        example:
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 *                          - 0
 */
//* Fetch sales report of sellers orders by partners API
router.get(
  "/sales-report",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchSalesReport.validation,
  partnerController.fetchSalesReport.handler,
);

//? post
/**
 * @openapi
 * /partner/add-sellers-using-file:
 *    post:
 *      tags:
 *      - Partner
 *      summary: add-sellers-using-file-by-partner
 *      description: This is the API for adding sellers using excel by partner.
 *      operationId: add-sellers-using-file-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters: []
 *      requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - add-sellers-excel-file
 *             properties:
 *               add-sellers-excel-file:
 *                 type: string
 *                 format: binary
 *                 description: "*Only .xlsx and .csv files are allowed."
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
 *                    example: File uploaded and Sellers added successfully
 *                  payload:
 *                    type: array
 *                    example: []
 */
//* sellers add by partner using excel sheet API
router.post(
  "/add-sellers-using-file",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  uploadExcel.single("add-sellers-excel-file"),
  partnerController.addSellersByPartnerUsingFile.validation,
  partnerController.addSellersByPartnerUsingFile.handler,
);

//? post
/**
 * @openapi
 * /partner/timeline-data-management:
 *    post:
 *      tags:
 *      - Partner
 *      summary: add-timeline-file-data-of-sellers-using-file-by-partner
 *      description: This is the API for uploading file for daily, weekly and monthly file using excel by partner.
 *      operationId: add-timeline-file-data-of-sellers-using-file-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters: []
 *      requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - timeline-data-management-file
 *               - timelineDataTenure
 *               - uploadDate
 *             properties:
 *               timeline-data-management-file:
 *                 type: string
 *                 format: binary
 *                 description: "*Only .xlsx and .csv files are allowed."
 *               timelineDataTenure:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 description: Time tenure value
 *                 example: "daily"
 *               dateRangeFromWeeklyOrMonthly:
 *                 type: string
 *                 example: "2026-01-01"
 *                 description: Date range from weekly or monthly
 *               dateRangeToWeeklyOrMonthly:
 *                 type: string
 *                 example: "2026-01-07"
 *                 description: Date range from weekly or monthly
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
 *                    example: (daily|weekly|monthly) File uploaded successfully
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Timeline wise data store using file by partner API
router.post(
  "/timeline-data-management",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  uploadExcel.single("timeline-data-management-file"),
  partnerController.uploadTimelineDataManagementFile.validation,
  partnerController.uploadTimelineDataManagementFile.handler,
);

//? put
/**
 * @openapi
 * /partner/confirm-seller-payment/{sellerId}:
 *    put:
 *      tags:
 *      - Partner
 *      summary: seller-payment-confirm-by-partner
 *      description: This is the API for confirming payment of seller by partner.
 *      operationId: seller-payment-confirm-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: path
 *          schema:
 *            type: string
 *          example: bb6bb695-b195-4ad8-b33d-671a8452033d
 *      requestBody:
 *       description: 'Request body payload'
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentType
 *             properties:
 *               paymentType:
 *                 type: string
 *                 enum: [Fixed, NMV]
 *                 example: Fixed
 *               isPaymentReceivedOrNot:
 *                 type: string
 *                 enum: [true, false]
 *                 example: true
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
 *                    example: Seller payment confirmation updated successfully
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* confirm seller payment by partner API
router.put(
  "/confirm-seller-payment/:sellerId",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.confirmSellerPayment.validation,
  partnerController.confirmSellerPayment.handler,
);

//? get
/**
 * @openapi
 * /partner/shipment-status-report:
 *    get:
 *      tags:
 *      - Partner
 *      summary: seller-shipment-status-by-partner
 *      description: This is the API for fetching shipment status data of seller by partner.
 *      operationId: seller-shipment-status-by-partner
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
 *                    example: Shipment status wise data fetched successfully
 *                  payload:
 *                    type: object
 *                    properties:
 *                        mainData:
 *                            type: object
 *                            properties:
 *                              delivered:
 *                                type: object
 *                                properties:
 *                                  label:
 *                                    type: string
 *                                    example: DELIVERED
 *                                  today:
 *                                    type: number
 *                                    example: 1
 *                                  total:
 *                                    type: number
 *                                    example: 1
 *                                  subData:
 *                                    type: object
 *                                    properties:
 *                                      delivered:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: DELIVERED
 *                                          today:
 *                                            type: number
 *                                            example: 1
 *                                          total:
 *                                            type: number
 *                                            example: 1
 *                              cancelled:
 *                                type: object
 *                                properties:
 *                                  label:
 *                                    type: string
 *                                    example: CANCELLED
 *                                  today:
 *                                    type: number
 *                                    example: 0
 *                                  total:
 *                                    type: number
 *                                    example: 1
 *                                  subData:
 *                                    type: object
 *                                    properties:
 *                                      cancelled:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: CANCELLED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      customerCancelled:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: CUSTOMER CANCELLED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      sellerCancelled:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: SELLER CANCELLED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 1
 *                              return:
 *                                type: object
 *                                properties:
 *                                  label:
 *                                    type: string
 *                                    example: RETURN
 *                                  today:
 *                                    type: number
 *                                    example: 0
 *                                  total:
 *                                    type: number
 *                                    example: 1
 *                                  subData:
 *                                    type: object
 *                                    properties:
 *                                      returned:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: RETURNED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 1
 *                                      refunded:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: REFUNDED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      rtoInitiated:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: RTO INITIATED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      rtoInTransit:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: RTO IN TRANSIT
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      rtoCompleted:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: RTO COMPLETED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                              movement:
 *                                type: object
 *                                properties:
 *                                  label:
 *                                    type: string
 *                                    example: MOVEMENT
 *                                  today:
 *                                    type: number
 *                                    example: 0
 *                                  total:
 *                                    type: number
 *                                    example: 1
 *                                  subData:
 *                                    type: object
 *                                    properties:
 *                                      placed:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: PLACED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 1
 *                                      sellerProcessing:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: SELLER PROCESSING
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      bagPicked:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: BAG_PICKED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      bagPacked:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: BAG_PACKED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      dpAssigned:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: DP_ASSIGNED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      outForPickup:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: OUT_FOR_PICKUP
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      inTransit:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: IN TRANSIT
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      outForDelivery:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: OUT FOR DELIVERY
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      deliveryAttempted:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: DELIVERY ATTEMPTED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      eddUpdated:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: EDD_UPDATED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      bagPickFailed:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: BAG_PICK_FAILED
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      rejectedByCustomer:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: REJECTED_BY_CUSTOMER
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *                                      bagLost:
 *                                        type: object
 *                                        properties:
 *                                          label:
 *                                            type: string
 *                                            example: BAG_LOST
 *                                          today:
 *                                            type: number
 *                                            example: 0
 *                                          total:
 *                                            type: number
 *                                            example: 0
 *
 */
//* Fetch seller shipment status report by partner API
router.get(
  "/shipment-status-report",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchShipmentStatusReport.validation,
  partnerController.fetchShipmentStatusReport.handler,
);

//? get
/**
 * @openapi
 * /partner/shipment-status-wise-orders:
 *    get:
 *      tags:
 *      - Partner
 *      summary: seller-shipment-wise-orders-by-partner
 *      description: This is the API for fetching shipment status wise orders by partner.
 *      operationId: seller-shipment-wise-orders-by-partner
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: query
 *          schema:
 *            type: string
 *          example: 56ba5caf-be3f-4dd5-b349-cff0fdab065e
 *        - name: orderStatus
 *          in: query
 *          schema:
 *            type: string
 *            enum: ["DELIVERED", "CUSTOMER CANCELLED", "CANCELLED", "SELLER CANCELLED", "RETURNED", "REFUNDED", "RTO INITIATED", "RTO IN TRANSIT", "RTO COMPLETED", "PLACED", "SELLER PROCESSING", "BAG_PICKED", "BAG_PACKED",  "DP_ASSIGNED", "OUT_FOR_PICKUP", "IN TRANSIT", "OUT FOR DELIVERY", "DELIVERY ATTEMPTED", "EDD_UPDATED", "BAG_PICK_FAILED", "REJECTED_BY_CUSTOMER", "BAG_LOST"]
 *          example: DELIVERED
 *          required: true
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
 *                    example: Shipment status wise Orders fetched successfully
 *                  payload:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        example: "fde54329-dead-4f73-a286-5f9882ac7e85"
 *                      sellerrId:
 *                        type: string
 *                        example: ER77R9
 *                      orderCreatedDate:
 *                        type: string
 *                        example: "2025-06-07"
 *                      orderId:
 *                        type: string
 *                        example: 17613677800912037A
 *                      shipmentId:
 *                        type: string
 *                        example: 17616678258431218295J
 *                      shipmentStatus:
 *                        type: string
 *                        example: DELIVERED
 *                      orderValue:
 *                        type: number
 *                        example: 699
 *                      deliveryPartner:
 *                        type: string
 *                        example: delhivery_jio
 *                      modeOfPayment:
 *                        type: string
 *                        example: COD
 *                      orderShipped:
 *                        type: boolean
 *                        example: true
 *                      createdAt:
 *                        type: string
 *                        example: "2026-01-13T19:42:57.448Z"
 *                      updatedAt:
 *                        type: string
 *                        example: "2026-01-13T19:42:57.458Z"
 *                      sellerDetails:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            example: 2af3b8b0-2d59-4c77-ac42-25ff70a95f7f
 *                          sellerId:
 *                            type: string
 *                            example: Y1BIK2
 *                          sellerName:
 *                            type: string
 *                            example: Doe Enterprize
 */
//* Fetch seller shipment status report by partner API
router.get(
  "/shipment-status-wise-orders",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchShipmentStatusWiseOrders.validation,
  partnerController.fetchShipmentStatusWiseOrders.handler,
);

//? get
/**
 * @openapi
 * /partner/file-placeholders:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-partner-file-upload-placeholders
 *      description: This is the API for fetching file upload placeholders.
 *      operationId: fetch-partner-file-upload-placeholders
 *      deprecated: false
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: fromDate
 *          in: query
 *          schema:
 *            type: string
 *          example: 2026-01-01
 *          required: true
 *        - name: toDate
 *          in: query
 *          schema:
 *            type: string
 *          example: 2026-01-31
 *          required: true
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
 *                  status:
 *                    type: integer
 *                    format: int32
 *                  message:
 *                    type: string
 *                  payload:
 *                    type: object
 *                    properties:
 *                      "2026-01-19":
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            partnerId:
 *                              type: string
 *                            fileType:
 *                              type: string
 *                            expectedDate:
 *                              type: string
 *                            status:
 *                              type: string
 *                            uploadedAt:
 *                              type: string
 *                              nullable: true
 *                            fileName:
 *                              type: number
 *                              nullable: true
 *                            createdAt:
 *                              type: string
 *                            updatedAt:
 *                              type: string
 *              example:
 *                success: true
 *                status: 200
 *                message: Fetched file upload placeholders successfully
 *                payload:
 *                  2026-02-01:
 *                    - id: "e27275e3-9b0b-4729-ab6d-7cf98b33c679"
 *                      partnerId: "4b21e5e9-a629-44fb-adfa-adf98aacbf19"
 *                      fileType: "daily"
 *                      expectedDate: "2026-02-01"
 *                      status: "pending"
 *                      uploadedAt: null
 *                      fileName: null
 *                      createdAt: "2026-02-01T19:42:57.448Z"
 *                      updatedAt: "2026-02-01T19:42:57.458Z"
 *                    - id: "e27275e3-9b0b-4729-ab6d-7cf98b33c679"
 *                      partnerId: "4b21e5e9-a629-44fb-adfa-adf98aacbf19"
 *                      fileType: "monthly"
 *                      expectedDate: "2026-02-01"
 *                      status: "pending"
 *                      uploadedAt: null
 *                      fileName: null
 *                      createdAt: "2026-02-01T19:42:57.448Z"
 *                      updatedAt: "2026-02-01T19:42:57.458Z"
 */
//* Fetch partner file upload placeholders API
router.get(
  "/file-placeholders",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchPartnerFileUploadPlaceholders.validation,
  partnerController.fetchPartnerFileUploadPlaceholders.handler,
);

export default router;
