const { distributePrizes } = require("./prize.service");
const { allowRoles } = require("../auth/auth.middleware");

async function prizeRoutes(fastify) {

  // 🟢 ADMIN / TEACHER: Distribute prizes
  fastify.post(
    "/:quizId/distribute",
    { preHandler: allowRoles(["ADMIN", "TEACHER"]) },
    async (req, reply) => {
      try {
        const { quizId } = req.params;

        const winners = await distributePrizes(quizId);

        reply.send({
          message: "Prizes distributed successfully",
          winners: winners.map(w => ({
            studentId: w.studentId,
            rank: w.rank,
            prize: w.prize
          }))
        });

      } catch (err) {
        reply.code(500).send({ message: err.message });
      }
    }
  );
}

module.exports = prizeRoutes;
