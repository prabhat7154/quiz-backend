const WalletTransaction = require("./wallet.model");
const User = require("../user/user.model");
const { allowRoles } = require("../auth/auth.middleware");

async function walletRoutes(fastify) {

  // 🟢 Get wallet balance
  fastify.get(
    "/balance",
    { preHandler: allowRoles(["STUDENT"]) },
    async (req, reply) => {
      const user = await User.findById(req.user.userId);
      reply.send({ wallet: user.wallet });
    }
  );

  // 🟢 Wallet transaction history
  fastify.get(
    "/transactions",
    { preHandler: allowRoles(["STUDENT"]) },
    async (req, reply) => {
      const txns = await WalletTransaction.find({
        userId: req.user.userId
      }).sort({ createdAt: -1 });

      reply.send(txns);
    }
  );
}

module.exports = walletRoutes;
