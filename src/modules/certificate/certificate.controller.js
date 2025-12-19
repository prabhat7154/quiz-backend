const path = require("path");
const fs = require("fs");
const Result = require("../result/result.model");
const Quiz = require("../quiz/quiz.model");
const User = require("../user/user.model");
const { generateCertificate } = require("./certificate.service");

// 🟢 DOWNLOAD CERTIFICATE
exports.downloadCertificate = async (req, reply) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.userId;

    const result = await Result.findOne({
      quizId,
      studentId
    });

    if (!result) {
      return reply.code(404).send({
        message: "Result not found"
      });
    }

    const quiz = await Quiz.findById(quizId);
    const user = await User.findById(studentId);

    const certDir = path.join(__dirname, "../../certificates");
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir);
    }

    const filePath = path.join(
      certDir,
      `certificate-${quizId}-${studentId}.pdf`
    );

    if (!fs.existsSync(filePath)) {
      await generateCertificate({
        studentName: user.name,
        quizTitle: quiz.title,
        score: result.score,
        total: result.totalQuestions,
        outputPath: filePath
      });
    }

    reply.download(filePath);

  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
