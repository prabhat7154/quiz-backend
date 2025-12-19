const Result = require("./result.model");
const Attempt = require("../attempt/attempt.model");
const Quiz = require("../quiz/quiz.model");

// 🟢 CALCULATE RESULT
exports.calculateResult = async (quizId, studentId) => {

  const quiz = await Quiz.findById(quizId);
  const attempt = await Attempt.findOne({
    quizId,
    studentId
  });

  if (!quiz || !attempt) {
    return null;
  }

  let score = 0;

  quiz.questions.forEach((question, index) => {
    const studentAnswer = attempt.answers.find(
      a => a.questionIndex === index
    );

    if (!studentAnswer) return;

    if (
      studentAnswer.answer.toString().trim().toLowerCase() ===
      question.correctAnswer.toString().trim().toLowerCase()
    ) {
      score++;
    }
  });

  const result = new Result({
    quizId,
    studentId,
    score,
    totalQuestions: quiz.questions.length
  });

  await result.save();

  return result;
};
