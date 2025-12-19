const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateCertificate = ({
  studentName,
  quizTitle,
  score,
  total,
  outputPath
}) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.pipe(fs.createWriteStream(outputPath));

    doc
      .fontSize(26)
      .text("Certificate of Achievement", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .text("This is to certify that", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(22)
      .removetext = null;

    doc
      .fontSize(22)
      .text(studentName, { align: "center", underline: true });

    doc.moveDown(1);

    doc
      .fontSize(16)
      .text(
        `has successfully completed the quiz "${quizTitle}"`,
        { align: "center" }
      );

    doc.moveDown(1);

    doc
      .fontSize(16)
      .text(
        `Score: ${score} / ${total}`,
        { align: "center" }
      );

    doc.moveDown(2);

    doc
      .fontSize(14)
      .text(
        `Date: ${new Date().toDateString()}`,
        { align: "center" }
      );

    doc.end();

    resolve();
  });
};
