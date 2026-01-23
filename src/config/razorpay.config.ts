import Razorpay from "razorpay";

import config from "../config/env.config";

const razorpay = new Razorpay({
  key_id: config.razorpay_key_id,
  key_secret: config.razorpay_key_secret
});

export default razorpay;
