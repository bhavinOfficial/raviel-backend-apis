import { Request } from "express";
import db from "../models";

const userRepository = {
  registerUser: async (req: Request) => {
    return await db.User.create(req.body);
  },

  findUser: async (req: any) => {
    return await db.User.findOne({
      where: {
        ...(req.user?.id && { id: req.user.id }),
        ...(req.body?.email && { email: req.body.email }),
        ...(req.body?.phoneNumber && { phoneNumber: req.body.phoneNumber }),
      },
      raw: true,
    });
  },

  updateUser: async (data: any, userId: string) => {
    const [updatedCount, [updatedUser]] = await db.User.update(data, {
      where: {
        id: userId,
      },
      raw: true,
      returning: true,
    });

    if (updatedCount) {
      return updatedUser;
    } else {
      return null;
    }
  },
};

export default userRepository;
