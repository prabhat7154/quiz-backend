const User = require("../user/user.model");
const WalletTransaction = require("./wallet.model");

// 💰 CREDIT WALLET (SAFE)
exports.creditWallet = async ({
  userId,
  quizId,
  amount,
  description
}) => {

  // Prevent duplicate credit
  const existing = await WalletTransaction.findOne({
    userId,
    quizId,
    type: "CREDIT"
  });

  if (existing) return;

  // Update wallet balance
  await User.findByIdAndUpdate(
    userId,
    { $inc: { wallet: amount } }
  );

  // Save transaction
  await WalletTransaction.create({
    userId,
    quizId,
    amount,
    type: "CREDIT",
    description
  });
};
