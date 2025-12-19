const Attempt = require("./attempt.model");
const redis = require("../../config/redis");

const MAX_VIOLATIONS = 3;

// 🟢 REPORT VIOLATION
exports.reportViolation = async (req, reply) => {
  try {
    const { quizId, reason } = req.body;
    const studentId = req.user.userId;

    const attempt = await Attempt.findOne({
      quizId,
      studentId,
      submitted: false
    });

    if (!attempt) {
      return reply.code(400).send({
        message: "No active exam"
      });
    }

    attempt.violations += 1;
    await attempt.save();

    // ❌ Limit crossed → auto submit
    if (attempt.violations >= MAX_VIOLATIONS) {
      attempt.submitted = true;
      attempt.autoSubmitted = true;
      await attempt.save();

      await redis.del(`exam:${quizId}:${studentId}`);

      return reply.send({
        message: "Exam auto-submitted due to cheating",
        violations: attempt.violations
      });
    }

    reply.send({
      message: "Violation recorded",
      violations: attempt.violations,
      reason
    });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
