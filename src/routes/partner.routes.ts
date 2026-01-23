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
  partnerController.partnerAddSellersViaForm.handler
);

//? put
/**
 * @openapi
 * /partner/update-seller/:sellerId:
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
 *          example: c7f862ef-6e24-428c-ae20-16d8d47207a
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
  partnerController.updateSellerAddedByPartner.handler
);

//? delete
/**
 * @openapi
 * /partner/delete-seller/:sellerId:
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
 *          example: c7f862ef-6e24-428c-ae20-16d8d47207a
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
  partnerController.deleteSellerAddedByPartner.handler
);

//? get
/**
 * @openapi
 * /partner/fetch-seller/:sellerId:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-seller-added-by-partner
 *      description: This is the API for fetching seller added by partner.
 *      operationId: fetch-seller-added-by-partner
 *      deprecated: false
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: path
 *          schema:
 *            type: string
 *          example: c7f862ef-6e24-428c-ae20-16d8d47207a
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
 *                    example: Seller fetched successfully
 *                  payload:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        example: "fde54329-dead-4f73-a286-5f9882ac7e85"
 *                      partnerId:
 *                        type: string
 *                        example: ca8d6719-b0df-4bde-a12f-5950517a9fba 
 *                      sellerId:
 *                        type: string
 *                        example: D77EE1
 *                      sellerName:
 *                        type: string
 *                        example: John Doe
 *                      brandName:
 *                        type: string
 *                        example: Jd evergreen
 *                      launchingDate:
 *                        type: string
 *                        example: 2025-06-14
 *                      listingDate:
 *                        type: string
 *                        example: 2025-08-16
 *                      sellerEmailId:
 *                        type: string
 *                        example: "john@example.com"
 *                      phoneNumber:
 *                        type: string
 *                        example: "9998886667"
 *                      password:
 *                        type: string
 *                        example: U2FsdGVkX1+xNDzASzT7dfWWoziZwb4rCeCB61dCg5w=
 *                      brandApproval:
 *                        type: string
 *                        example: pending
 *                      gstNumber:
 *                        type: string
 *                        example: "29AAACR5055K1Z6"
 *                      trademarkClass:
 *                        type: string
 *                        example: pending
 *                      totalSKUs:
 *                        type: number
 *                        example: 0
 *                      pendingSKUs:
 *                        type: number
 *                        example: 0
 *                      liveSKUs:
 *                        type: number
 *                        example: 0
 *                      productCategories:
 *                        type: array
 *                        items: 
 *                          type: string
 *                        example: ["electronics", "clothing"]
 *                      createdAt:
 *                        type: string
 *                        example: "2026-01-13T19:42:57.448Z"
 *                      updatedAt:
 *                        type: string
 *                        example: "2026-01-13T19:42:57.458Z"
 */
//* Seller fetch by partner API
router.get(
  "/fetch-seller/:sellerId",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchSellerAddedByPartner.validation,
  partnerController.fetchSellerAddedByPartner.handler
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
 *          example: c7f862ef-6e24-428c-ae20-16d8d47207a
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
  partnerController.fetchAllSellersAddedByPartner.handler
);


//? get
/**
 * @openapi
 * /partner/fetch-all-orders:
 *    get:
 *      tags:
 *      - Partner
 *      summary: fetch-all-sellers-orders-added-by-partner
 *      description: This is the API for fetching all the sellers;s orders added by partner.
 *      operationId: fetch-all-sellers-orders-added-by-partner
 *      deprecated: false
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - name: sellerId
 *          in: query
 *          schema:
 *            type: string
 *          example: c7f862ef-6e24-428c-ae20-16d8d47207a
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
 *              type: 
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
 *                        sellerId:
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
  "/fetch-all-orers",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER],
  }),
  partnerController.fetchAllOrdersByPartner.validation,
  partnerController.fetchAllOrdersByPartner.handler
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
  partnerController.addSellersByPartnerUsingFile.handler
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
 *             properties:
 *               timeline-data-management-file:
 *                 type: string
 *                 format: binary
 *                 description: "*Only .xlsx and .csv files are allowed."
 *               timeline-data-tenure:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 description: Time tenure value
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
  partnerController.uploadTimelineDataManagementFile.handler
);


//? put
/**
 * @openapi
 * /partner/confirm-seller-payment/:sellerId:
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
 *          in: query
 *          schema:
 *            type: string
 *          example: D77WE7
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
  partnerController.confirmSellerPayment.handler
);

export default router;
