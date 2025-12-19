const controller = require("./cheat.controller");
const { allowRoles } = require("../auth/auth.middleware");

async function cheatRoutes(fastify) {

  fastify.post(
    "/violation",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.reportViolation
  );
}

module.exports = cheatRoutes;
