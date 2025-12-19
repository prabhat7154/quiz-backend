const Result = require("./result.model");
const { verifyJWT } = require("../auth/auth.middleware");

async function resultRoutes(fastify) {

  // 🟢 GET LEADERBOARD (Quiz-wise)
  fastify.get(
    "/:quizId/leaderboard",
    { preHandler: verifyJWT },
    async (req, reply) => {
      try {
        const { quizId } = req.params;

        const results = await Result.find({ quizId })
          .sort({ score: -1, createdAt: 1 })
          .populate("studentId", "name");

        let leaderboard = [];
        let currentRank = 0;
        let lastScore = null;

        results.forEach((res, index) => {
          if (res.score !== lastScore) {
            currentRank = index + 1;
            lastScore = res.score;
          }

          leaderboard.push({
            rank: currentRank,
            name: res.studentId.name,
            score: res.score,
            total: res.totalQuestions
          });
        });

        reply.send({
          quizId,
          leaderboard
        });

      } catch (err) {
        reply.code(500).send({ message: err.message });
      }
    }
  );
}

module.exports = resultRoutes;
