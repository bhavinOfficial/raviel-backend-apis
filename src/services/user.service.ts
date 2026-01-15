import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";
import userBusinessDetailsRepository from "../repositories/userBusinessDetails.repository";

const userService = {
  registerUser: async (req: Request) => {
    const hashPassword = await helper.hashPassword({
      password: req.body.password,
    });
    req.body.password = hashPassword;
    const createdUser = (await userRepository.registerUser(req)).toJSON();
    delete createdUser.password;
    return createdUser;
  },

  loginUser: async (req: Request, res: Response) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    const isValidPassword = await helper.comparePassword({
      password: req.body.password,
      hashedPassword: user.password,
    });

    if (!isValidPassword) return message.INVALID_CREDENTIALS;

    await userRepository.updateUser({ lastLoginDate: new Date() }, user?.id);

    delete user.password;

    const accessToken = await helper.generateToken({
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "strict",
    //   maxAge: 15 * 60 * 1000,
    // });

    return { accessToken };
  },

  updateUser: async (req: any) => {
    const userInfo = {
      ...(req.body.firstName && { firstName: req.body.firstName }),
      ...(req.body.lastName && { lastName: req.body.lastName }),
      ...(req.body.phoneNumber && { phoneNumber: req.body.phoneNumber }),
    }
    const userBusinessInfo = {
      ...(req.body.businessName && { businessName: req.body.businessName }),
      ...(req.body.gstNumber && { gstNumber: req.body.gstNumber }),
      ...(req.body.gstAddress && { gstAddress: req.body.gstAddress }),
      ...(req.body.manufacturerNumber && { manufacturerNumber: req.body.manufacturerNumber }),
      ...(req.body.fullFillerNumber && { fullFillerNumber: req.body.fullFillerNumber }),
      ...(req.body.pickupAddress && { pickupAddress: req.body.pickupAddress }),
      ...(req.body.businessType && { businessType: req.body.businessType }),
      ...(req.body.pancardNumber && { pancardNumber: req.body.pancardNumber }),
    }

    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    if (Object.keys(userInfo).length) {
      const updatedUserInfo = await userRepository.updateUser(userInfo, user?.id);
      if (!updatedUserInfo) return message.FAILED;
    }

    if (Object.keys(userBusinessInfo).length) {
      const updatedUserBusinessInfo = await userBusinessDetailsRepository.updateUserBusinessDetails(userBusinessInfo, user?.id);
      if (!updatedUserBusinessInfo) return message.FAILED;
    }

    return true;
  },

  getLoggedInUserDetails: async (req: any) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    delete user.password;

    return user;
  },
};

export default userService;
