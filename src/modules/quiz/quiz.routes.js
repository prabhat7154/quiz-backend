const controller = require("./quiz.controller");
const { verifyJWT, allowRoles } = require("../auth/auth.middleware");

async function quizRoutes(fastify) {

  // =========================
  // 🟢 TEACHER ROUTES
  // =========================

  // Create Quiz (Teacher only)
  fastify.post(
    "/",
    { preHandler: allowRoles(["TEACHER"]) },
    controller.createQuiz
  );

  // Add Question (Teacher only)
  fastify.post(
    "/:quizId/question",
    { preHandler: allowRoles(["TEACHER"]) },
    controller.addQuestion
  );

  // =========================
  // 🟢 STUDENT ROUTES
  // =========================

  // Get all quizzes (Student)
  fastify.get(
    "/",
    { preHandler: verifyJWT },
    controller.getAllQuizzes
  );

  // Register student to quiz
  fastify.post(
    "/:quizId/register",
    { preHandler: allowRoles(["STUDENT"]) },
    controller.registerToQuiz
  );
}

module.exports = quizRoutes;
