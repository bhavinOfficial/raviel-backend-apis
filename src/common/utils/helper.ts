import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JwtToken } from "../../types/helper.interface";
import config from "../../config/env.config";
// import axios from "axios";
// import sendGridMail from "@sendgrid/mail";
// import formData from "form-data";
// import { mailTemplate } from "./mailTemplate";

// TODO /* Initialize sendGrid credentials */
// sendGridMail.setApiKey(config.sendgrid.apiKey);
// const client = Twilio(config.twilio.accountSid, config.twilio.authToken);

// TODO: Create a helper function with different services
const helper = {
  //? Create hash password function
  hashPassword: async ({ password }: { password: string }) => {
    //* Make hash password function
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },

  //? Make generate JWT token function
  generateToken: async ({ data }: { data: JwtToken }) => {
    //* Make generate token function
    const token = await JWT.sign(data, config.jwt.secret, { expiresIn: "7d" });
    return token;
  },

  //? Make decode JWT token function
  decodeToken: async ({ token }: { token: string }) => {
    //* Make decode token function
    const decoded = await JWT.verify(token, config.jwt.secret);
    return decoded;
  },

  //? Compare hash password function
  comparePassword: async ({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) => {
    //* Make compare password function
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  },

  //   //* Send email using sendGrid
  //   sendMail: async ({ to, otp }: { to: string; otp: number }) => {
  //     try {
  //       await sendGridMail.send({
  //         from: config.sendgrid.email,
  //         to,
  //         subject: "Otp for verification",
  //         text: `Greetings From the Juno.Your OTP is ${otp}`,
  //         html: mailTemplate.sendOtp({ otp }),
  //       });
  //       console.log("Test email sent successfully");
  //     } catch (error: any) {
  //       console.error("Error sending test email in sendgrid");
  //       console.error(error.response.body);
  //       await helper.sendEmailMailGun({ to, otp });
  //     }
  //   },
};

export default helper;
