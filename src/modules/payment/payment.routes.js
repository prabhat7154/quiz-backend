const controller = require("./payment.controller");
const { allowRoles } = require("../auth/auth.middleware");

async function paymentRoutes(fastify) {

  // Create order
  fastify.post(
    "/create",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.createPayment
  );

  // Verify payment
  fastify.post(
    "/verify",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.verifyPayment
  );
}

module.exports = paymentRoutes;
