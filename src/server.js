require("dotenv").config();
const fastify = require("./app");
const connectDB = require("./config/db");
const redis = require("./config/redis");
const Attempt = require("./modules/attempt/attempt.model");
const { Server } = require("socket.io");

const start = async () => {
  try {
    // 1️⃣ DB connect
    await connectDB();

    // 2️⃣ Fastify listen
    await fastify.listen({
      port: Number(process.env.PORT),
      host: "0.0.0.0"
    });

    console.log(`Server running on port ${process.env.PORT}`);

    // 🔥 3️⃣ SOCKET.IO — CORRECT WAY
    const io = new Server(fastify.server, {
      cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
      console.log("Student connected:", socket.id);

      socket.on("join-exam", async ({ quizId, studentId }) => {
        const key = `exam:${quizId}:${studentId}`;
        let remainingTime = await redis.get(key);

        if (!remainingTime) {
          const attempt = await Attempt.findOne({
            quizId,
            studentId,
            submitted: false
          });

          if (!attempt) {
            socket.emit("error", "No active exam");
            return;
          }

          remainingTime =
            Math.floor((attempt.endTime - new Date()) / 1000);

          await redis.set(key, remainingTime, "EX", remainingTime);
        }

        const interval = setInterval(async () => {
          remainingTime--;

          if (remainingTime <= 0) {
            clearInterval(interval);
            socket.emit("time-over");
            await redis.del(key);
            return;
          }

          await redis.set(key, remainingTime, "EX", remainingTime);
          socket.emit("timer", remainingTime);
        }, 1000);

        socket.on("disconnect", () => {
          clearInterval(interval);
          console.log("Student disconnected");
        });
      });
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
