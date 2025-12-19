const fastify = require("fastify")({ logger: true });

fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET
});

// 👇 HEALTH CHECK
fastify.get("/", async (req, reply) => {
  reply.send({
    status: "OK",
    message: "Quiz Backend is running 🚀"
  });
});

// 👇 ROUTES
fastify.register(require("./modules/auth/auth.routes"), {
  prefix: "/api/auth"
});

fastify.register(require("./modules/user/user.routes"), {
  prefix: "/api/user"
});
fastify.register(require("./modules/quiz/quiz.routes"), {
  prefix: "/api/quiz"
});

fastify.register(require("./modules/attempt/attempt.routes"), {
  prefix: "/api/exam"
});

fastify.register(require("./modules/result/result.routes"), {
  prefix: "/api/result"
});


fastify.register(require("./modules/result/prize.routes"), {
  prefix: "/api/prize"
});

fastify.register(require("./modules/wallet/wallet.routes"), {
  prefix: "/api/wallet"
});


fastify.register(require("./modules/payment/payment.routes"), {
  prefix: "/api/payment"
});


fastify.register(require("./modules/attempt/cheat.routes"), {
  prefix: "/api/cheat"
});

fastify.register(require("./modules/certificate/certificate.routes"), {
  prefix: "/api/certificate"
});

module.exports = fastify;
