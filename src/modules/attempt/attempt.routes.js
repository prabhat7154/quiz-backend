const controller = require("./attempt.controller");
const { allowRoles } = require("../auth/auth.middleware");

async function attemptRoutes(fastify) {

  // Start exam
  fastify.post(
    "/:quizId/start",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.startExam
  );

  // Submit answer
  fastify.post(
    "/:quizId/answer",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.submitAnswer
  );

  // Final submit
  fastify.post(
    "/:quizId/submit",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.submitExam
  );
}

module.exports = attemptRoutes;
