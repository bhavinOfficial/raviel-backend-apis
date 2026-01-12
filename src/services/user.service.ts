import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { helper } from "../common/utils";
import { message } from "../common/constants";

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
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    const dataToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.mobile,
    };

    const updatedData = await userRepository.updateUser(dataToUpdate, user?.id);

    if (!updatedData) return message.FAILED;

    delete updatedData.password;

    return updatedData;
  },

  getLoggedInUserDetails: async (req: any) => {
    const user = await userRepository.findUser(req);

    if (!user) return message.USER_NOT_FOUND;

    delete user.password;

    return user;
  },
};

export default userService;
