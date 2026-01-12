import express from "express";
import userBusinessDetailsController from "../controllers/userBusinessDetails.controller";
import { enums } from "../common/constants";
import auth from "../middlewares/auth.middleware";
const router = express.Router();

//? POST
/**
 * @openapi
 * /user-business-details:
 *    post:
 *      tags:
 *      - User-Business-Details
 *      summary: Create-User-Business-Details
 *      description: This is the API for adding user business details.
 *      operationId: Create-User-Business-Details
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
 *                role:
 *                  type: string
 *                  example: seller
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
 *              required:
 *                - role
 *                - businessName
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
 *                    example: User onboading completed successfully.
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Add user business details API
router.post(
  "/",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER, enums.ROLE.SELLER],
  }),
  userBusinessDetailsController.createUserBusinessDetails.validation,
  userBusinessDetailsController.createUserBusinessDetails.handler
);


//? PUT
/**
 * @openapi
 * /user-business-details:
 *    put:
 *      tags:
 *      - User-Business-Details
 *      summary: Update-User-Business-Details
 *      description: This is the API for updating user business details.
 *      operationId: Update-User-Business-Details
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
 *              required:
 *                - role
 *                - businessName
 *        required: true
 *      responses:
 *        201:
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
 *                    example: User business details updated successfully.
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Update user business details API
router.put(
  "/",
  auth({
    isTokenRequired: true,
    usersAllowed: [enums.ROLE.PARTNER, enums.ROLE.SELLER],
  }),
  userBusinessDetailsController.updateUserBusinessDetails.validation,
  userBusinessDetailsController.updateUserBusinessDetails.handler
);


export default router;
