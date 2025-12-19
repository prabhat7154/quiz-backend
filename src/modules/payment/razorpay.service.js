const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 🟢 Create Order
exports.createOrder = async (amount) => {
  const options = {
    amount: amount * 100, // rupees → paise
    currency: "INR"
  };

  return await razorpay.orders.create(options);
};

// 🟢 Verify Signature
exports.verifyPayment = ({ orderId, paymentId, signature }) => {
  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
