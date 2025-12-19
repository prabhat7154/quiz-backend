// Login ke baad user ko token milta hai

// Har request ke saath wo token bhejta hai

// Middleware token check karta hai

// Agar token sahi → request aage

// Galat / missing → reject 

// Middleware = Gatekeeper
// Ye middleware:

// token verify karega

// fail hua → request wahi ruk jayegi

// Iska matlab kya hua?
// allowRoles(["TEACHER"])  Sirf teacher access karega

// allowRoles(["ADMIN"])  Sirf admin

// allowRoles(["STUDENT", "TEACHER"]) Dono allowed

async function verifyJWT(req, reply) {
  try {
    // Header se token uthao
    await req.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      message: "Unauthorized - Token invalid ya missing"
    });
  }
}

function allowRoles(roles = []) {
  return async function (req, reply) {
    try {
      await req.jwtVerify();

      if (!roles.includes(req.user.role)) {
        return reply.code(403).send({
          message: "Access denied"
        });
      }
    } catch (err) {
      reply.code(401).send({
        message: "Unauthorized"
      });
    }
  };
}

module.exports = {
  verifyJWT,
  allowRoles
};
