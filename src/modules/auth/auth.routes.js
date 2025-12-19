const controller = require("./auth.controller");

async function authRoutes(fastify) {
  fastify.post("/register", controller.register);
  fastify.post("/login", controller.login); // 👈 Jab /login aaye → login() function call karo
}

module.exports = authRoutes;
