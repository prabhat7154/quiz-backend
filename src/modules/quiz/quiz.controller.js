const Quiz = require("./quiz.model");

// 🟢 CREATE QUIZ (Teacher only)
exports.createQuiz = async (req, reply) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      startTime,
      endTime
    } = req.body;

    const quiz = new Quiz({
      title,
      description,
      price,
      duration,
      startTime,
      endTime,
      teacherId: req.user.userId
    });

    await quiz.save();

    reply.send({
      message: "Quiz created successfully",
      quizId: quiz._id
    });
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 ADD QUESTION
exports.addQuestion = async (req, reply) => {
  try {
    const { quizId } = req.params;
    const questionData = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return reply.code(404).send({ message: "Quiz not found" });
    }

    quiz.questions.push(questionData);
    await quiz.save();

    reply.send({
      message: "Question added successfully"
    });
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
// 🟢 GET ALL ACTIVE QUIZZES (Student)
exports.getAllQuizzes = async (req, reply) => {
  try {
    const quizzes = await Quiz.find(
      { startTime: { $lte: new Date() } },
      "-questions.correctAnswer"
    );

    reply.send(quizzes);
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 REGISTER STUDENT TO QUIZ
exports.registerToQuiz = async (req, reply) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return reply.code(404).send({ message: "Quiz not found" });
    }

    if (quiz.registeredStudents.includes(studentId)) {
      return reply.code(400).send({
        message: "Already registered"
      });
    }

    quiz.registeredStudents.push(studentId);
    await quiz.save();

    reply.send({
      message: "Registered successfully"
    });
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
