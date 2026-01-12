import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import partnerRepository from "../repositories/partner.repository";

const partnerService = {
  partnerAddSellersViaForm: async (req: any) => {
    const seller = await partnerRepository.findSellerAddedByPartner(req.body.sellerId);
    console.log("seller: ", seller);

    if (!seller) return message.SELLER_ALREADY_EXIST;
    console.log("user242342: ", seller);

   const dataToCreate = {
      ...req.body,
      partnerId: req.user.id
    };

    const createdSeller = await partnerRepository.partnerAddSellersViaForm(dataToCreate);

    if (!createdSeller) return message.FAILED;

    return createdSeller;
  },

};

export default partnerService;
