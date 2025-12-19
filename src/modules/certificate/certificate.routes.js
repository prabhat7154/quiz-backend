const controller = require("./certificate.controller");
const { allowRoles } = require("../auth/auth.middleware");

async function certificateRoutes(fastify) {

  fastify.get(
    "/:quizId",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.downloadCertificate
  );
}

module.exports = certificateRoutes;
