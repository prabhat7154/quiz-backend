const Payment = require("./payment.model");
const Quiz = require("../quiz/quiz.model");
const { createOrder, verifyPayment } = require("./razorpay.service");

// 🟢 CREATE PAYMENT ORDER
exports.createPayment = async (req, reply) => {
  try {
    const { quizId } = req.body;
    const userId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return reply.code(404).send({ message: "Quiz not found" });
    }

    const order = await createOrder(quiz.price);

    await Payment.create({
      userId,
      quizId,
      amount: quiz.price,
      razorpayOrderId: order.id
    });

    reply.send({
      orderId: order.id,
      amount: quiz.price,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 VERIFY PAYMENT
exports.verifyPayment = async (req, reply) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const isValid = verifyPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      return reply.code(400).send({ message: "Invalid payment" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id
    });

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    reply.send({ message: "Payment verified successfully" });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
