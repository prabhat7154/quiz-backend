const Attempt = require("./attempt.model");
const Quiz = require("../quiz/quiz.model");
const redis = require("../../config/redis");

// 🟢 START EXAM
exports.startExam = async (req, reply) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return reply.code(404).send({ message: "Quiz not found" });
    }

    if (quiz.startTime && new Date() < quiz.startTime) {
      return reply.code(400).send({
        message: "Exam has not started yet"
      });
    }

    if (!quiz.registeredStudents.includes(studentId)) {
      return reply.code(403).send({
        message: "You are not registered for this quiz"
      });
    }

    const existingAttempt = await Attempt.findOne({ quizId, studentId });
    if (existingAttempt) {
      return reply.code(400).send({
        message: "Exam already started"
      });
    }

    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + quiz.duration * 60000
    );

    const attempt = new Attempt({
      quizId,
      studentId,
      startTime,
      endTime,
      answers: []
    });

    await attempt.save();

    const totalSeconds = quiz.duration * 60;
    await redis.set(
      `exam:${quizId}:${studentId}`,
      totalSeconds,
      "EX",
      totalSeconds
    );

    reply.send({
      message: "Exam started",
      startTime,
      endTime
    });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 SUBMIT ANSWER  ✅ (THIS WAS MISSING)
exports.submitAnswer = async (req, reply) => {
  try {
    const { quizId } = req.params;
    const { questionIndex, answer } = req.body;
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

    if (new Date() > attempt.endTime) {
      attempt.submitted = true;
      await attempt.save();
      await redis.del(`exam:${quizId}:${studentId}`);

      return reply.code(400).send({
        message: "Time over. Exam auto submitted"
      });
    }

    // overwrite answer if same questionIndex
    attempt.answers = attempt.answers.filter(
      a => a.questionIndex !== questionIndex
    );

    attempt.answers.push({ questionIndex, answer });
    await attempt.save();

    reply.send({ message: "Answer saved" });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 FINAL SUBMIT  ✅
const { calculateResult } = require("../result/result.controller");

// 🟢 FINAL SUBMIT
exports.submitExam = async (req, reply) => {
  try {
    const { quizId } = req.params;
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

    attempt.submitted = true;
    await attempt.save();

    await redis.del(`exam:${quizId}:${studentId}`);

    // 🔥 RESULT CALCULATION
    const result = await calculateResult(quizId, studentId);

    reply.send({
      message: "Exam submitted successfully",
      score: result.score,
      total: result.totalQuestions
    });

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

