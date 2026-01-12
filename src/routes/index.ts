import { Request, Response, Router } from "express";
import userRoutes from "./user.routes";
import userBusinessDetailsRoutes from "./userBusinessDetails.routes";
import partnerRoutes from "./partner.routes";
import ApiResponse from "../common/utils/apiResponse";

const router = Router();

router.use("/user", userRoutes);
router.use("/user-business-details", userBusinessDetailsRoutes);
router.use("/partner", partnerRoutes);

//? GET
/**
 * @openapi
 * /health:
 *    get:
 *      tags:
 *      - Health
 *      summary: Health check
 *      description: This is the API for health check.
 *      operationId: Health-Check
 *      deprecated: false
 *      parameters: []
 *      requestBody: {}
 *      responses:
 *        '200':
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
 *                    example: Welcome to Raviel Backend APIs
 *                  payload:
 *                    type: object
 *                    example: {}
 */
//* Health Route
router.get("/health", async (req: Request, res: Response) => {
  return ApiResponse.OK({
    res,
    message: `Welcome to Raviel Backend APIs`,
  });
});

//* Wrong Route
router.use(/.*/, (req: Request, res: Response) => {
  return ApiResponse.NOT_FOUND({
    res,
    message: `Oops! Looks like you're lost.`,
  });
});

export default router;
