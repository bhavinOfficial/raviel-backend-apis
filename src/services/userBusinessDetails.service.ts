import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import userBusinessDetailsRepository from "../repositories/userBusinessDetails.repository";

const userBusinessDetailsService = {
  createUserBusinessDetails: async (req: any) => {
    const user = await userRepository.findUser(req);

    
    if (!user) return message.USER_NOT_FOUND;
    console.log("user242342: ", user);

    if (user.isOnboardingCompleted) return "User already completed onboarding!";

    delete req.body.role;

   const dataToCreate = {
      ...(req.user.role === "partner" ? {
        businessName: req.body.businessName,
        gstNumber: req.body.gstNumber,
        gstAddress: req.body.gstAddress
      } : req.body),
      userId: req.user.id
    };

    const createdData = await userBusinessDetailsRepository.createUserBusinessDetails(dataToCreate);

    if (!createdData) return message.FAILED;

    const dataToUpdate = {
      isOnboardingCompleted: true,
    };

    const updatedData = await userRepository.updateUser(dataToUpdate, user?.id);

    if (!updatedData) return message.FAILED;

    return createdData;
  },

  updateUserBusinessDetails: async (req: any) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    console.log("req.user.role: ", req.user.role);
    // req.user.role = "seller";

    console.log("req.user.role: ", req.user.role);


    const dataToUpdate = {
      ...(req.user.role === "partner" ? {
        businessName: req.body.businessName,
        gstNumber: req.body.gstNumber,
        gstAddress: req.body.gstAddress
      } : req.body)
    };

    console.log("dataToUpdate: ", dataToUpdate);

    const updatedData = await userBusinessDetailsRepository.updateUserBusinessDetails(dataToUpdate, req.user.id);

    if (!updatedData) return message.FAILED;

    return updatedData;
  },
};

export default userBusinessDetailsService;
