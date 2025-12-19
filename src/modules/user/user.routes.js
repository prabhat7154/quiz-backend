const { verifyJWT, allowRoles } = require("../auth/auth.middleware");

async function userRoutes(fastify) {
     // 🟢 Any logged-in user
  fastify.get(
    "/profile",
    { preHandler: verifyJWT },
    async (req, reply) => {
      reply.send({
        message: "Profile data",
        user: req.user
      });
    }
  );
  
  // 🟢 Only TEACHER
  fastify.post(
    "/teacher-only",
    { preHandler: allowRoles(["TEACHER"]) },
    async (req, reply) => {
      reply.send({
        message: "Teacher access granted"
      });
    }
  );

  
}

module.exports = userRoutes;
