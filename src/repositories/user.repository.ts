import { Request } from "express";
import db from "../models";
import { Op } from "sequelize";

const userRepository = {
  registerUser: async (req: Request) => {
    return await db.User.create(req.body);
  },

  findUser: async (req: any) => {

    return await db.User.findOne({
      where: {
        [Op.or]: [
          req.user?.id && { id: req.user.id },
          req.body?.email && { email: req.body.email },
          req.body?.phoneNumber && { phoneNumber: req.body.phoneNumber },
        ].filter(Boolean), // ✅ removes false/undefined entries
      },
      include: [
        {
          model: db.UserBusinessDetails,
          as: "userBusinessDetails",
          required: false, // ✅ IMPORTANT
        }
      ],
      raw: true,
      nest: true
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
