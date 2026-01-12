import { Request, Response } from "express";
import { validator } from "../middlewares/validator.middleware";
import Joi from "joi";
import { enums, message } from "../common/constants";
import { ApiResponse } from "../common/utils";
import partnerService from "../services/partner.service";

const partnerController = {
  partnerAddSellersViaForm: {
    validation: validator({}),
    handler: async (req: any, res: Response) => {
      console.log("req.params: ", req.params);
      console.log("req.query: ", req.query);
      console.log("req.body: ", req.body);
      console.log("req.file: ", req.file);
      console.log("req.files: ", req.files);
      return;
      const addedsellerByPartner = await partnerService.partnerAddSellersViaForm(req);
      if (!addedsellerByPartner)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.FAILED,
        });
      if (addedsellerByPartner === message.SELLER_ALREADY_EXIST)
        return ApiResponse.BAD_REQUEST({
          res,
          message: message.SELLER_ALREADY_EXIST,
        });
      return ApiResponse.CREATED({
        res,
        message: "Seller added by partner successfully",
        payload: {},
      });
    },
  },

};

export default partnerController;
